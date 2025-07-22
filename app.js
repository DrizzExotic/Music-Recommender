// Mocked song dataset for demonstration
const mockSongs = [
  { id: 1, title: "Echoes", artist: "Dreamshade", genre: "Rock" },
  { id: 2, title: "Chill Vibes", artist: "Lo-Fi Beats", genre: "Lo-fi" },
  { id: 3, title: "Sunset Drive", artist: "Sundive", genre: "Indie" },
  { id: 4, title: "Push Harder", artist: "GymBro", genre: "Workout" },
  { id: 5, title: "Melancholy Blue", artist: "Joji", genre: "Sad Pop" },
  { id: 6, title: "Energize", artist: "SynthSpark", genre: "Electronic" },
  { id: 7, title: "Tranquil Sky", artist: "ZenHarmony", genre: "Ambient" }
];

let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
let dislikedSongs = [];

function generateRecommendations() {
  const input = document.getElementById("inputBox").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (input === "") {
    resultsDiv.innerHTML = "<p>Please enter a mood, keyword, or song.</p>";
    return;
  }

  // Score songs by input matches
  const scoredSongs = mockSongs
    .filter(song => !dislikedSongs.includes(song.id))
    .map(song => {
      let score = 0;
      if (song.title.toLowerCase().includes(input)) score += 3;
      if (song.artist.toLowerCase().includes(input)) score += 2;
      if (song.genre.toLowerCase().includes(input)) score += 1;
      return { ...song, score };
    });

  // Songs with positive score
  const positiveMatches = scoredSongs.filter(s => s.score > 0).sort((a, b) => b.score - a.score);

  let results = [];

  if (positiveMatches.length >= 3) {
    // If 3 or more matches, show max 5 best matches
    results = positiveMatches.slice(0, 5);
  } else {
    // Less than 3 matches, add random songs to reach minimum 3
    results = positiveMatches;

    // Get remaining songs not disliked and not in positiveMatches
    const excludedIds = dislikedSongs.concat(positiveMatches.map(s => s.id));
    const remaining = mockSongs.filter(s => !excludedIds.includes(s.id));

    // Shuffle remaining songs
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }

    // Add random songs until we have at least 3 or until no more remaining
    for (let i = 0; results.length < 3 && i < remaining.length; i++) {
      results.push(remaining[i]);
    }
  }

  if (results.length === 0) {
    resultsDiv.innerHTML = "<p>No results found. Try a different keyword.</p>";
    return;
  }

  results.forEach(song => displaySong(song, resultsDiv));
}


function displaySong(song, container) {
  const songCard = document.createElement("div");
  songCard.className = "song-card";

  const info = document.createElement("div");
  info.className = "song-info";
  info.innerHTML = `<strong>${song.title}</strong><br>${song.artist} — ${song.genre}`;

  const buttons = document.createElement("div");
  buttons.className = "song-buttons";

  const likeBtn = document.createElement("button");
  likeBtn.textContent = "👍";
  likeBtn.title = "Like this";
  likeBtn.onclick = () => likeSong(song);

  const dislikeBtn = document.createElement("button");
  dislikeBtn.textContent = "👎";
  dislikeBtn.title = "Dislike this";
  dislikeBtn.onclick = () => dislikeSong(song.id);

  buttons.appendChild(likeBtn);
  buttons.appendChild(dislikeBtn);

  songCard.appendChild(info);
  songCard.appendChild(buttons);

  container.appendChild(songCard);
}

function likeSong(song) {
  if (!likedSongs.find(s => s.id === song.id)) {
    likedSongs.push(song);
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
    updateLikedList();
  }
}

function dislikeSong(songId) {
  if (!dislikedSongs.includes(songId)) {
    dislikedSongs.push(songId);
    generateRecommendations();
  }
}

function updateLikedList() {
  const likedDiv = document.getElementById("likedSongs");
  likedDiv.innerHTML = "";

  likedSongs.forEach(song => {
    const songCard = document.createElement("div");
    songCard.className = "song-card";
    songCard.innerHTML = `<div class="song-info"><strong>${song.title}</strong><br>${song.artist} — ${song.genre}</div>`;
    likedDiv.appendChild(songCard);
  });
}

function clearLikedSongs() {
  likedSongs = [];
  localStorage.removeItem("likedSongs");
  updateLikedList();
}

// Load liked songs on page load
updateLikedList();
