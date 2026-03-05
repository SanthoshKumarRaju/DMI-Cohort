// React App Deployment page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Command execution simulation
    const commands = document.querySelectorAll('.code-block');
    
    commands.forEach(commandBlock => {
        if (commandBlock.textContent.includes('ssh') || 
            commandBlock.textContent.includes('npm') ||
            commandBlock.textContent.includes('git')) {
            
            const runButton = document.createElement('button');
            runButton.className = 'run-command-btn';
            runButton.innerHTML = '<i class="fas fa-play"></i>';
            runButton.title = 'Simulate command execution';
            
            runButton.addEventListener('click', function() {
                simulateCommandExecution(commandBlock);
            });
            
            commandBlock.appendChild(runButton);
        }
    });

    function simulateCommandExecution(commandBlock) {
        const originalContent = commandBlock.textContent;
        const lines = originalContent.split('\n').filter(line => line.trim());
        let currentLine = 0;
        
        commandBlock.textContent = '';
        commandBlock.style.minHeight = '100px';
        
        function typeLine() {
            if (currentLine < lines.length) {
                const line = lines[currentLine];
                let charIndex = 0;
                
                function typeChar() {
                    if (charIndex < line.length) {
                        commandBlock.textContent += line.charAt(charIndex);
                        charIndex++;
                        setTimeout(typeChar, 10);
                    } else {
                        commandBlock.textContent += '\n';
                        currentLine++;
                        setTimeout(typeLine, 500);
                    }
                }
                
                typeChar();
            } else {
                // Restore original content after simulation
                setTimeout(() => {
                    commandBlock.textContent = originalContent;
                    commandBlock.style.minHeight = '';
                }, 2000);
            }
        }
        
        typeLine();
    }

    // Deployment status indicator
    const statusItems = document.querySelectorAll('.status-item');
    let deploymentStatus = 'in-progress';
    
    function updateDeploymentStatus() {
        statusItems.forEach((item, index) => {
            setTimeout(() => {
                item.querySelector('.status-value').textContent = 'Completed';
                item.querySelector('.status-value').className = 'status-value completed';
            }, index * 1000);
        });
        
        setTimeout(() => {
            deploymentStatus = 'completed';
            showDeploymentSuccess();
        }, statusItems.length * 1000);
    }
    
    function showDeploymentSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'deployment-success';
        successMessage.innerHTML = `
            <i class="fas fa-rocket"></i>
            <div>
                <h4>Deployment Successful!</h4>
                <p>Your React app is now live on Azure VM</p>
            </div>
        `;
        
        document.querySelector('.project-main').appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.classList.add('show');
        }, 100);
    }
    
    // Auto-start deployment simulation on page load
    setTimeout(updateDeploymentStatus, 2000);
});