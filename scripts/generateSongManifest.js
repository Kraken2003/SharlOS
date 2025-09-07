const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, '../public/audio');
const outputPath = path.join(__dirname, '../src/songManifest.ts');

function generateSongManifest() {
  try {
    // Read all files in the audio directory
    const files = fs.readdirSync(audioDir);
    
    // Filter audio files
    const audioFiles = files.filter(file => file.endsWith('.mp3'));
    
    // Generate song objects
    const songs = audioFiles.map(audioFile => {
      const baseName = path.basename(audioFile, '.mp3');
      
      // Find matching image file
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      let imageSrc = '';
      
      for (const ext of imageExtensions) {
        const imageFile = baseName + ext;
        if (files.includes(imageFile)) {
          imageSrc = `audio/${imageFile}`;
          break;
        }
      }
      
      return {
        name: baseName,
        audioSrc: `audio/${audioFile}`,
        imageSrc: imageSrc
      };
    });

    // Generate TypeScript file content
    const content = `// Auto-generated song manifest
export interface SongManifest {
  name: string;
  audioSrc: string;
  imageSrc: string;
}

export const songs: SongManifest[] = ${JSON.stringify(songs, null, 2)};
`;

    // Write the file
    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated song manifest with ${songs.length} songs`);
    
    // Log found songs
    songs.forEach((song, index) => {
      console.log(`${index + 1}. ${song.name}`);
    });

  } catch (error) {
    console.error('❌ Error generating song manifest:', error);
    process.exit(1);
  }
}

// Run the generator
generateSongManifest();