import React, { useState } from "react";

function CaptionForm({ onSubmit }) {
  const [caption, setCaption] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSubmit(caption);
    generateMemeImage(caption);
    setCaption("");
  };

  // Example function to generate meme image from caption using DALL-E API
  async function generateMemeImage(caption) {
    // const response = await fetch("https://api.openai.com/v1/images", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer org-07HA9uaZIG7WMmxBHJnxJsR8", // Replace with your OpenAI API key
    //   },
    //   body: JSON.stringify({
    //     prompt: caption,
    //     model: "text-dalle-003",
    //     temperature: 0.7,
    //   }),
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "a white siamese cat",
      n: 1,
      size: "1024x1024",
    });
    const image_url = response.data[0].url;

    // const data = await response.json();
    console.log(data);
    console.log(image_url);
    // return data.url; // URL of the generated meme image
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Enter your meme caption"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default CaptionForm;
