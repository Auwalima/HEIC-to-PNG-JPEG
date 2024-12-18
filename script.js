const fileInput = document.getElementById("fileInput");
      const dropZone = document.getElementById("dropZone");
      const convertBtn = document.getElementById("convertBtn");
      const previewImage = document.getElementById("previewImage");
      const downloadLink = document.getElementById("downloadLink");
      const fileInfo = document.getElementById("fileInfo");

      // Prevent default drag behaviors
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
      });

      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Highlight drop zone when item is dragged over it
      ["dragenter", "dragover"].forEach((eventName) => {
        dropZone.addEventListener(eventName, highlight, false);
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, unhighlight, false);
      });

      function highlight(e) {
        dropZone.classList.add("highlight");
      }

      function unhighlight(e) {
        dropZone.classList.remove("highlight");
      }

      // Handle dropped files
      dropZone.addEventListener("drop", handleDrop, false);

      function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
      }

      dropZone.addEventListener("click", () => {
        fileInput.click();
      });

      fileInput.addEventListener("change", (e) => {
        handleFiles(e.target.files);
      });

      function handleFiles(files) {
        if (files.length > 0) {
          const file = files[0];
          if (file.name.toLowerCase().endsWith(".heic")) {
            fileInfo.textContent = `Selected file: ${file.name}`;
            convertBtn.disabled = false;
            convertBtn.onclick = () => convertHeicToJpeg(file);
          } else {
            alert("Please select a HEIC file.");
            fileInfo.textContent = "";
            convertBtn.disabled = true;
          }
        }
      }

      async function convertHeicToJpeg(file) {
        try {
          convertBtn.disabled = true;
          convertBtn.textContent = "Converting...";

          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });

          const url = URL.createObjectURL(convertedBlob);
          previewImage.src = url;
          previewImage.style.display = "block";

          downloadLink.href = url;
          downloadLink.download = file.name
            .replace(".heic", ".jpg")
            .replace(".HEIC", ".jpg");
          downloadLink.style.display = "block";

          convertBtn.textContent = "Convert Image";
          convertBtn.disabled = false;
        } catch (error) {
          console.error(error);
          alert("Error converting image. Please try again.");
          convertBtn.textContent = "Convert Image";
          convertBtn.disabled = false;
        }
      }