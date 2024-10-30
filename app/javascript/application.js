// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
document.getElementById("create").addEventListener("click", async function() {
    const editorContent = document.getElementById("code-editor").value;
    const selectedStyle = document.querySelector('input[name="style"]:checked').value;

    // Create a prompt using the fixed phrase with the selected style
    const prompt = `Draw a simplified, dumb, representation of the image in ${selectedStyle} style.\nCode:\n${editorContent}`;

    // Show the loader and clear any previous content
    const loader = document.getElementById("loader");
    const responseContent = document.getElementById("response-content");

    // Clear previous content and show the loader
    responseContent.innerHTML = "";
    loader.style.display = "block";

    try {
        const response = await fetch("/imagination/create_ai_powered_image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        const data = await response.json();

        // Hide the loader
        loader.style.display = "none";

        // Display error if response has an error
        if (data.error) {
            responseContent.innerText = data.error;
            return;
        }

        // Display the generated image if image_url is present
        if (data.image_url) {
            const img = document.createElement("img");
            img.src = data.image_url;
            img.alt = "Generated Image";
            img.style.width = "100%";
            img.style.height = "auto";

            // Append the new image
            responseContent.appendChild(img);
        } else {
            responseContent.innerText = "Image Not Generated.";
        }
    } catch (error) {
        console.error("Error:", error);
        responseContent.innerText = "An error occurred. Check the console for details.";
    } finally {
        // Hide the loader in case of any errors as well
        loader.style.display = "none";
    }
});
