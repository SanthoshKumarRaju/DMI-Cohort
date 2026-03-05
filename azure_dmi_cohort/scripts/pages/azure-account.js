// Azure Account Setup page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add copy functionality for code blocks
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        block.style.position = 'relative';
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = '<i class="far fa-copy"></i>';
        copyButton.title = 'Copy to clipboard';
        
        copyButton.addEventListener('click', function() {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.innerHTML = '<i class="far fa-copy"></i>';
                }, 2000);
            });
        });
        
        block.appendChild(copyButton);
    });

    // Add step completion tracking
    const steps = document.querySelectorAll('.step');
    let completedSteps = 0;

    steps.forEach((step, index) => {
        const completeBtn = document.createElement('button');
        completeBtn.className = 'step-complete-btn';
        completeBtn.innerHTML = '<i class="far fa-circle"></i>';
        completeBtn.title = 'Mark as completed';
        
        completeBtn.addEventListener('click', function() {
            if (step.classList.contains('completed')) {
                step.classList.remove('completed');
                this.innerHTML = '<i class="far fa-circle"></i>';
                completedSteps--;
            } else {
                step.classList.add('completed');
                this.innerHTML = '<i class="fas fa-check-circle"></i>';
                completedSteps++;
            }
            
            updateProgress();
        });
        
        step.querySelector('.step-header').appendChild(completeBtn);
    });

    function updateProgress() {
        const progress = (completedSteps / steps.length) * 100;
        console.log(`Progress: ${progress.toFixed(1)}%`);
        
        // You could save progress to localStorage or send to analytics
        localStorage.setItem('azure-account-progress', progress);
    }

    // Load previous progress
    const savedProgress = localStorage.getItem('azure-account-progress');
    if (savedProgress) {
        console.log(`Resuming from ${savedProgress}% progress`);
    }
});