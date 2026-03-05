// Three-Tier Network page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Interactive network diagram
    const diagram = document.getElementById('networkDiagram');
    if (diagram) {
        makeDiagramInteractive(diagram);
    }

    function makeDiagramInteractive(diagramContainer) {
        const tiers = diagramContainer.querySelectorAll('.diagram-tier');
        
        tiers.forEach(tier => {
            tier.style.cursor = 'pointer';
            tier.addEventListener('click', function() {
                showTierDetails(this);
            });
            
            // Add hover effects
            tier.addEventListener('mouseenter', function() {
                this.style.transform = this.style.transform + ' scale(1.1)';
                this.style.zIndex = '10';
            });
            
            tier.addEventListener('mouseleave', function() {
                this.style.transform = this.style.transform.replace(' scale(1.1)', '');
                this.style.zIndex = '';
            });
        });
    }

    function showTierDetails(tierElement) {
        const tierName = tierElement.querySelector('.tier-name').textContent;
        const tierDesc = tierElement.querySelector('.tier-desc').textContent;
        const tierIp = tierElement.querySelector('.tier-ip')?.textContent || '';
        
        const modal = document.createElement('div');
        modal.className = 'tier-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h3>${tierName}</h3>
                <p><strong>Description:</strong> ${tierDesc}</p>
                ${tierIp ? `<p><strong>IP Range:</strong> ${tierIp}</p>` : ''}
                <div class="tier-config">
                    <h4>Configuration Details</h4>
                    <ul>
                        <li>Network Security Group: Applied</li>
                        <li>Route Table: Configured</li>
                        <li>Access: ${getTierAccess(tierName)}</li>
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function getTierAccess(tierName) {
        switch(tierName) {
            case 'Web Tier':
                return 'Internet + Load Balancer';
            case 'App Tier':
                return 'Web Tier only';
            case 'DB Tier':
                return 'App Tier only';
            case 'Load Balancer':
                return 'Internet facing';
            default:
                return 'Restricted';
        }
    }

    // Traffic flow animation
    function animateTrafficFlow() {
        const connections = [
            { from: '.lb', to: '.web', color: '#0078d4' },
            { from: '.web', to: '.app', color: '#00bc70' },
            { from: '.app', to: '.db', color: '#d83b01' }
        ];
        
        connections.forEach(conn => {
            createTrafficAnimation(conn.from, conn.to, conn.color);
        });
    }
    
    function createTrafficAnimation(fromSelector, toSelector, color) {
        const fromElement = document.querySelector(fromSelector);
        const toElement = document.querySelector(toSelector);
        
        if (!fromElement || !toElement) return;
        
        const packet = document.createElement('div');
        packet.className = 'network-packet';
        packet.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 5;
        `;
        
        diagram.appendChild(packet);
        
        animatePacket(packet, fromElement, toElement, color);
    }
    
    function animatePacket(packet, from, to, color) {
        const fromRect = from.getBoundingClientRect();
        const toRect = to.getBoundingClientRect();
        const diagramRect = diagram.getBoundingClientRect();
        
        const startX = fromRect.left + fromRect.width/2 - diagramRect.left;
        const startY = fromRect.top + fromRect.height/2 - diagramRect.top;
        const endX = toRect.left + toRect.width/2 - diagramRect.left;
        const endY = toRect.top + toRect.height/2 - diagramRect.top;
        
        packet.style.left = startX + 'px';
        packet.style.top = startY + 'px';
        
        const animation = packet.animate([
            { transform: `translate(0, 0)`, opacity: 1 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px)`, opacity: 0 }
        ], {
            duration: 2000,
            easing: 'linear'
        });
        
        animation.onfinish = () => {
            packet.remove();
            // Continue animation
            setTimeout(() => createTrafficAnimation(from, to, color), 1000);
        };
    }
    
    // Start traffic animation
    setTimeout(animateTrafficFlow, 3000);
});

// Add CSS for network animations
const networkCSS = `
.tier-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.network-packet {
    box-shadow: 0 0 10px currentColor;
}

.diagram-tier {
    transition: transform 0.3s ease;
}
`;

const style = document.createElement('style');
style.textContent = networkCSS;
document.head.appendChild(style);