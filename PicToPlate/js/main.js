function DisplayPreviewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const preview = document.getElementById("image-preview");
    preview.src = reader.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(event.target.files[0]);
}

async function FetchPopConfig(pop_endpoint, token) {
  //const server = "https://staging-api.eyepop.ai";
  //const server = "http://localhost:8000";

  return fetch(pop_endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  }).then((response) => response.json());
}

function sortAndCount(arr) {
  const counts = {}; // An empty object, like my social calendar

  // Let's count 'em up. One umbrella, ah ah ah 🦇🌂
  arr.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });

  // Now, let's sort this bad boy like it's high school gym class
  const sortedItems = Object.keys(counts).sort();

  // Finally, let's make it look like a grocery list
  const sortedAndCounted = sortedItems.map(
    (item) => `${item}: ${counts[item]}`
  );

  return sortedAndCounted;
}

async function sortAndCountHTML(arr) {
  var calorieCount = 0;
  var html = "";
  var ingredients = [];

  arr.forEach((item) => {
    const splitItem = item.split(": ");
    const itemName = splitItem[0];
    ingredients.push(itemName);
    const itemCount = splitItem[1];
    switch (itemName) {
      case "apple":
        calorieCount += 95 * itemCount;
        break;
      case "banana":
        calorieCount += 105 * itemCount;
        break;
      case "orange":
        calorieCount += 45 * itemCount;
        break;
      case "broccoli":
        calorieCount += 50 * itemCount;
        break;
      case "carrot":
        calorieCount += 25 * itemCount;
        break;
      default:
        break;
    }
    html += `<p>${itemName} x ${itemCount}</p>`;
    
  });
  if(calorieCount == 0){
    html += `<p>No ingredients detected.</p>`;
  }
  else{
    html += `<p>Total Calories: ${calorieCount}</p>`;
  }
  

  const apiKey = "APIkey"; // Replace with your actual API key
  const apiUrl = "https://api.openai.com/v1/engines/davinci/completions"; // Endpoint for completion

  async function generateRecipe(ingredients) {
    const prompt = `Create a recipe that primarily uses the following ingredients: ${ingredients.join(
      ", "
    )}. Recipe:`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt,
          max_tokens: 20, // Adjust as needed
          n: 1, // Number of completions to generate
          stop: ["\n"], // Stop generation at a newline character
        }),
      });

      const data = await response.json();

      const recipe = data.choices[0].text.trim();
      return recipe;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Example usage

  try {
    const recipe = await generateRecipe(ingredients);
    console.log(recipe);
    html += `<p>${recipe}</p>`;
  } catch (error) {
    console.error(error);
  }
  return html;
}

function DisplayPreviewImageCanvas(event) {
  const reader = new FileReader();
  reader.onload = function () {
    DrawImage(reader.result);
  };

  console.log(event.target.files);
  reader.readAsDataURL(event.target.files[0]);
}

async function DrawImage(imageUrl, watermark_enabled = true) {
  // Prepare the canvas like a canvas preparing... person
  var canvas = document.getElementById("maincanvas");
  var ctx = canvas.getContext("2d");

  const imgLoad = new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

  const img = await imgLoad;

  const originalHeight = canvas.height;
  const originalWidth = canvas.width;

  // Create the image and put it on the canvas like a pro
  const boxSide = 600;

  // Maintain aspect ratio like it's the law!
  let newWidth, newHeight;
  if (img.width > img.height) {
    newWidth = boxSide;
    newHeight = (img.height / img.width) * boxSide;
  } else {
    newHeight = boxSide;
    newWidth = (img.width / img.height) * boxSide;
  }

  // Position the image in the center like a pop star on stage
  //const xPos = (boxSide - newWidth) / 2;
  //const yPos = (boxSide - newHeight) / 2;

  //canvas.dataset['xPos'] = xPos;
  //canvas.dataset['yPos'] = yPos;

  // Keep the edges smooth like a stick of butter
  ctx.imageSmoothingQuality = "high";
  canvas.width = newWidth;
  canvas.height = newHeight;
  canvas.style.width = newWidth;
  canvas.style.height = newHeight;

  ctx.clearRect(0, 0, 600, 600);
  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  if (watermark_enabled) {
    //try {
    console.log("drawing watermark");
    const watermark = new Image();
    watermark.addEventListener("load", (e) => {
      x = canvas.width - 228 - 5;
      y = canvas.height - 52 - 5;
      ctx.drawImage(watermark, x, y);
    });
    watermark.src = "css/images/eyepop-logo.svg";

    //} catch (e) {

    //}
  }
}

function ClearDisplay() {
  document.getElementById("timing").innerHTML = "__ms";
  document.getElementById("txt_json").innerHTML =
    "<span class='text-muted'>processing</a>";
}

// A function that helps to recursively go through the JSON object and edit it
function jazzUpClassLabels(obj) {
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      jazzUpClassLabels(obj[key]);
    }
    if (key === "classLabel") {
      obj[key] = `<span class="strong">${obj[key]}</span>`;
    }
  }
}

function FormatPre() {
  // Grab the text content of the <pre> element
  let preContent = document.getElementById("txt_json").textContent;

  // Convert the string to a JavaScript object
  let parsedJson = JSON.parse(preContent);

  // Let the jazzing up begin!
  jazzUpClassLabels(parsedJson);

  // Convert the jazzed-up object back to a string
  let newPreContent = JSON.stringify(parsedJson, null, 2);

  // Put the newly minted, jazzed-up JSON back into the <pre> element, complete with sassy bold classLabels!
  document.getElementById("txt_json").innerHTML = newPreContent.replace(
    /&quot/g,
    '"'
  ); //.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"(<span class=\\"bold\\">.*?<\/span>)"/g, '$1');
}
