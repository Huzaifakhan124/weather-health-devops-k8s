// Dynamic status update for DevOps pipeline demo
document.addEventListener("DOMContentLoaded", () => {
    console.log("Health & Weather Portal loaded successfully!");
    
    const statusEl = document.getElementById("status-text");
    
    // For active status 
    setTimeout(() => {
        statusEl.innerText = "System Status: Managed via K3s & ArgoCD 🚀";
    }, 3000);
});