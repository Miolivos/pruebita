/*AUDIO*/
const playPauseButton = document.getElementById('playPauseButton');
const mySong = document.getElementById('mySong');
const buttonText = document.getElementById('buttonText');

if (playPauseButton && mySong && buttonText) {
    playPauseButton.addEventListener('click', () => {
        if (mySong.paused) {
            mySong.play();
            buttonText.textContent = '❚❚ PAUSE';
        } else {
            mySong.pause();
            buttonText.textContent = '► PLAY';
        }
    });

    mySong.addEventListener('ended', () => {
        buttonText.textContent = '► PLAY';
    });

    mySong.addEventListener('play', () => {
        buttonText.textContent = '❚❚ PAUSE';
    });

    mySong.addEventListener('pause', () => {
        if (mySong.currentTime > 0 && !mySong.ended) {
            buttonText.textContent = '► PLAY';
        }
    });
} else {
    console.error('Error: No se pudieron encontrar todos los elementos HTML necesarios (botón, audio o texto).');
}

/*PUNTERO*/
const customCursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
});

const interactiveElements = document.querySelectorAll('.interactive-image');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        customCursor.classList.add('hovering');
    });
    element.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hovering');
    });
});

document.querySelectorAll('a, p, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
        customCursor.classList.add('hovering');
    });
    element.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hovering');
    });
});

document.addEventListener('mouseleave', () => {
    customCursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    customCursor.style.opacity = '1';
});

/*CARGA DATOS*/
async function datos() {
    try {
        const consulta = await fetch("https://raw.githubusercontent.com/Miolivos/Coldplay_Trabajo-Final/refs/heads/main/coldplay.json");
        const data = await consulta.json();
        console.log("Datos del JSON cargados:", data);

        /*CARRUSEL*/
        const albumCarousel = document.getElementById('albumCarousel');
        if (!albumCarousel) {
            console.error("No se encontró el elemento con ID 'albumCarousel'. No se puede construir el carrusel.");
        } else {
            const albumsForCarousel = data.filter(item => item.Tipo === "Álbum");

            albumsForCarousel.forEach(album => {
                const albumTitleFromJSON = album.Álbum;
                const imageSrc = album.cover_image;

                if (imageSrc) {
                    const albumItemDiv = document.createElement('div');
                    albumItemDiv.classList.add('album-item');

                    const imgElement = document.createElement('img');
                    imgElement.classList.add('album-cover-img');
                    imgElement.src = imageSrc;
                    imgElement.alt = `Portada de ${albumTitleFromJSON}`;

                    const textDiv = document.createElement('div');
                    textDiv.classList.add('album-info');
                    textDiv.innerHTML = `<p class="album-title">${albumTitleFromJSON}</p><p class="album-year">${album['Año de lanzamiento']}</p>`;

                    albumItemDiv.appendChild(imgElement);
                    albumItemDiv.appendChild(textDiv);
                    albumCarousel.appendChild(albumItemDiv);
                }
            });
        }

    
        displayAlbumPopularityVisualization(data); 

    } catch (error) {
        console.error("Error al cargar o procesar el JSON:", error);
    }
}


/*DATOS POPULARIDAD DE ALBUMES */
function displayAlbumPopularityVisualization(data) { 
    const vizContainer = document.getElementById('albumCoversVizContainer');
    if (!vizContainer) {
        console.error("No se encontró el elemento con ID 'albumCoversVizContainer'. No se puede mostrar la visualización.");
        return;
    }

    vizContainer.innerHTML = ''; 

    const albums = data.filter(item => item.Tipo === "Álbum" && item.cover_image); 
    const allSongs = data.filter(item => item.Tipo === "Canción"); 

    const songCountsPerAlbum = new Map();

    allSongs.forEach(song => {
        if (song.Álbum) {
            const albumName = song.Álbum;
            songCountsPerAlbum.set(albumName, (songCountsPerAlbum.get(albumName) || 0) + 1);
        }
    });


    albums.sort((a, b) => {
        const countA = songCountsPerAlbum.get(a.Álbum) || 0;
        const countB = songCountsPerAlbum.get(b.Álbum) || 0;
        return countB - countA;
    });
  
    const minSize = 120;
    const maxSize = 300;
    const sizeIncrement = 25; 
    albums.forEach(album => {
        const albumName = album.Álbum;
        const numSongsInAlbum = songCountsPerAlbum.get(albumName) || 0;

        const size = minSize + (numSongsInAlbum * sizeIncrement);
        const finalSize = Math.min(Math.max(size, minSize), maxSize); 
        const albumVizItem = document.createElement('div');
        albumVizItem.classList.add('album-viz-item');
        albumVizItem.style.width = `${finalSize}px`;
        albumVizItem.style.height = `${finalSize}px`;

        const imgElement = document.createElement('img');
        imgElement.src = album.cover_image;
        imgElement.alt = `Portada de ${album.Álbum}`;
        imgElement.title = `${album.Álbum} (${numSongsInAlbum} canciones)`; 

        albumVizItem.appendChild(imgElement);

        const albumNameDiv = document.createElement('div');
        albumNameDiv.classList.add('album-viz-name');
        albumNameDiv.textContent = album.Álbum;
        albumVizItem.appendChild(albumNameDiv);

        vizContainer.appendChild(albumVizItem);
    });
}

/*CARGA DE LA VENTANA*/
window.onload = () => {
    datos();
};