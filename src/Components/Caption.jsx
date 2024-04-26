import { useState, useEffect } from "react";
import "../App.css";
import OpenAI from "openai";
import GifPlayer from "react-gif-player";

function MemeTokenSystem() {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([
    // "https://upload.wikimedia.org/wikipedia/commons/9/9b/Love-game-logo-256x256.png",
    // "https://cdn-icons-png.flaticon.com/256/10776/10776271.png",
    // "https://i2.wp.com/genshinbuilds.aipurrjects.com/genshin/characters/albedo/image.png?strip=all&quality=100",
    // "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d1950217-1756-437a-b5cd-07d6f8e35a05/d3k3av3-f968ed09-2ba5-48a6-9ead-e16279132c35.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2QxOTUwMjE3LTE3NTYtNDM3YS1iNWNkLTA3ZDZmOGUzNWEwNVwvZDNrM2F2My1mOTY4ZWQwOS0yYmE1LTQ4YTYtOWVhZC1lMTYyNzkxMzJjMzUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Do2BOGFe7JYMpbF_1I4Ol9RSHT5qhTA7Vg1C95N_3f8",
  ]);
  const [isLoading, setLoading] = useState(false);
  const [votes, setVotes] = useState({});
  const [gifProfilePhoto, setGifProfilePhoto] = useState(null);
  const [totalFunds, setTotalFunds] = useState(0);
  const [tokensPurchased, setTokensPurchased] = useState(0);
  const totalSupply = 1000;
  const pricePerToken = 0.1;

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    const initialVotes = Object.fromEntries(
      images.map((_, index) => [index, { upvotes: 0, downvotes: 0 }])
    );
    setVotes(initialVotes);
  }, [images]);

  async function generateMemeImages() {
    try {
      setLoading(true);
      const response = await openai.images.generate({
        prompt: caption,
        n: 4,
        size: "256x256",
      });
      const { data } = await response.json();
      const urls = data.map((item) => item.url);
      setImages(urls);
      setLoading(false);
    } catch (error) {
      console.error("Error generating meme images:", error);
      setLoading(false);
    }
  }

  const voteForAsset = (index, type) => {
    setVotes((prevVotes) => {
      const updatedVotes = { ...prevVotes };
      if (type === "upvote") {
        updatedVotes[index] = {
          ...updatedVotes[index],
          upvotes: updatedVotes[index].upvotes + 1,
        };
      } else if (type === "downvote") {
        updatedVotes[index] = {
          ...updatedVotes[index],
          downvotes: updatedVotes[index].downvotes + 1,
        };
      }
      return updatedVotes;
    });
  };

  const handleGenerateProfile = () => {
    const winningIndex = getWinningImageIndex();
    if (winningIndex !== null) {
      const winningImage = images[winningIndex];
      setGifProfilePhoto(winningImage);
    }
  };

  // Function to determine the winning image index based on votes
  const getWinningImageIndex = () => {
    let maxVotes = 0;
    let winningIndex = null;
    for (const index in votes) {
      const { upvotes } = votes[index];
      console.log(upvotes);
      if (upvotes > maxVotes) {
        maxVotes = upvotes;
        winningIndex = index;
      }
    }

    return winningIndex;
  };

  const handleContributeFunds = (amount) => {
    const purchasedTokens = Math.floor(amount / pricePerToken);
    const remainingTokens = totalSupply - tokensPurchased;
    if (remainingTokens < purchasedTokens) {
      alert(
        `You can only purchase up to ${remainingTokens} tokens to limit the collective purchase to 15% of the total supply.`
      );
      return;
    }
    setTotalFunds(totalFunds + amount);
    setTokensPurchased(tokensPurchased + purchasedTokens);
  };

  return (
    <div className="App">
      <h1>AI-generated Meme Token System</h1>
      <div className="form">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter your prompt"
        />
        <button onClick={generateMemeImages}>Generate</button>
      </div>
      <div className="imageBox">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          images.map((url, index) => (
            <div key={index} className="imageContainer">
              <img src={url} alt={`Meme ${index}`} />
              <div>Upvotes: {votes[index]?.upvotes}</div>
              <div>Downvotes: {votes[index]?.downvotes}</div>
              <div className="voteButtons">
                <button onClick={() => voteForAsset(index, "upvote")}>
                  Upvote
                </button>
                <button onClick={() => voteForAsset(index, "downvote")}>
                  Downvote
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="profilePhoto">
        {gifProfilePhoto && (
          <>
            <h2>GIF Profile Photo</h2>
            <GifPlayer gif={gifProfilePhoto} autoplay={true} />
          </>
        )}
        <button className="profile" onClick={handleGenerateProfile}>
          Generate Profile
        </button>
      </div>

      <div className="buyTokens">
        <h2>Buy Tokens</h2>
        <p>Total supply: {totalSupply}</p>
        <p>Price per token: ${pricePerToken}</p>
        <p>Total Funds Contributed: ${totalFunds}</p>
        <p>Total Tokens Purchased: {tokensPurchased}</p>
        <div className="tokenInput">
          <button onClick={() => handleContributeFunds(10)}>
            Contribute $10
          </button>
          <button onClick={() => handleContributeFunds(20)}>
            Contribute $20
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemeTokenSystem;
