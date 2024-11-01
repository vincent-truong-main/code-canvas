// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
document.getElementById("create").addEventListener("click", async function() {
    const editorContent = document.getElementById("code-editor").value;
    const selectedStyle = document.querySelector('input[name="style"]:checked').value;

    // Static Analysis
    const loc = editorContent.split("\n").filter(line => line.trim() !== "").length; // Lines of Code
    const functionCount = (editorContent.match(/function\s+\w+|=>|def\s+\w+|class\s+\w+/g) || []).length; // Number of functions
    const complexity = (editorContent.match(/if|else if|while|for|case|catch|switch|&&|\|\|/g) || []).length + 1; // Cyclomatic Complexity

    // Update metrics in the HTML
    document.getElementById("loc-count").innerText = loc;
    document.getElementById("function-count").innerText = functionCount;
    document.getElementById("complexity-count").innerText = complexity;

    // Clear previous content and show the loader
    const loader = document.getElementById("loader");
    const responseContent = document.getElementById("response-content");
    loader.style.display = "block"; // Show loader
    responseContent.querySelectorAll("img").forEach(img => img.remove()); // Remove previous images only

    // Create the prompt using the selected style and code content
    const prompt = `Convert this code to simple art in ${selectedStyle} style and all words are in english. It is a very informative drawing and cartoonish and simple in nature. Intelligent as well. Positive. Useful. No Limits. Beautiful. Distilled. Simplest image possible.`;

    try {
        const response = await fetch("/imagination/create_ai_powered_image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();

        // Hide the loader after receiving the response
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
        // Ensure the loader is hidden in case of any errors as well
        loader.style.display = "none";
    }
});
