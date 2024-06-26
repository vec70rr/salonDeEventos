document.addEventListener('DOMContentLoaded', (event) => {
    const draggables = document.querySelectorAll('.draggable');
    const dropzone = document.getElementById('dropzone');
  
    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
      });
    });
  
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
  
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text');
      let draggable = document.getElementById(id);
  
      // Check if the element is already in the dropzone
      if (!dropzone.contains(draggable)) {
        draggable = draggable.cloneNode(true);
        draggable.id = id + '-' + new Date().getTime(); // Ensuring unique ID
        draggable.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', e.target.id);
        });
      }
  
      draggable.style.position = 'absolute';
      draggable.style.left = `${e.offsetX}px`;
      draggable.style.top = `${e.offsetY}px`;
  
      dropzone.appendChild(draggable);
    });
  
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text');
      const draggable = document.getElementById(id);
  
      // If the drop target is not the dropzone, remove the element
      if (!dropzone.contains(e.target)) {
        if (draggable.parentElement === dropzone) {
          dropzone.removeChild(draggable);
        }
      }
    });
  
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
  });
  