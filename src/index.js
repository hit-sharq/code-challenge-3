// Your code here
document.addEventListener('DOMContentLoaded', () => {
    const filmsList = document.getElementById('films');
    const movieTitle = document.getElementById('title');
    const movieRuntime = document.getElementById('runtime');
    const movieDescription = document.getElementById('film-info');
    const movieShowtime = document.getElementById('showtime');
    const availableTickets = document.getElementById('ticket-num');
    const moviePoster = document.getElementById('poster');
    const buyTicketButton = document.getElementById('buy-ticket');

    // Function to fetch movie list from the server and populate the menu
    function fetchAndPopulateMovieList() {
        fetch('https://code-challenge-3-7spb.onrender.com/films')
            .then(response => response.json())
            .then(films => {
                films.forEach(film => {
                    const filmItem = document.createElement('li');
                    filmItem.classList.add('film', 'item');
                    filmItem.innerHTML = `
            ${film.title}
            <button id="${film.id}">Delete</button>
            
            `
                    filmsList.appendChild(filmItem);
                    deleteMovie(film)

                    if ((film.capacity - film.tickets_sold) === 0) {
                        filmItem.classList.add("sold-out"); 
                    }
                    filmItem.addEventListener('click', () => {
                        fetchAndDisplayMovieDetails(film);
                    });
                    firstMovieData(films[0]);
                });
            })
            .catch(error => {
                console.error('Error fetching movie list:', error);
            });
    }

    function firstMovieData(movie){
        movieTitle.textContent = movie.title;
        movieRuntime.textContent = movie.runtime + ' minutes';
        movieDescription.textContent = movie.description;
        movieShowtime.textContent = movie.showtime;
        availableTickets.textContent = movie.capacity - movie.tickets_sold;
        moviePoster.src = movie.poster;
        buyTicket(movie);
    }

    function fetchAndDisplayMovieDetails(film) {
        fetch(`https://code-challenge-3-7spb.onrender.com/films/${film.id}`)
            .then(response => response.json())
            .then(movie => {
                movieTitle.textContent = movie.title;
                movieRuntime.textContent = movie.runtime + ' minutes';
                movieDescription.textContent = movie.description;
                movieShowtime.textContent = movie.showtime;
                availableTickets.textContent = movie.capacity - movie.tickets_sold;
                moviePoster.src = movie.poster;

                if (movie.capacity - movie.tickets_sold === 0) {
                    buyTicketButton.textContent = 'Sold Out';
                    buyTicketButton.disabled = true;
                } else {
                    buyTicketButton.textContent = 'Buy Ticket';
                    buyTicketButton.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);cc
            });
            buyTicket(film);
    }

    function buyTicket(movie) {
        buyTicketButton.onclick = () => {
            movie.tickets_sold++;

            fetch(`https://code-challenge-3-7spb.onrender.com/films/films/${movie.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tickets_sold: movie.tickets_sold
                })
            })
            .then(response => response.json())
            .then(updatedMovie => {
                availableTickets.textContent = updatedMovie.capacity - updatedMovie.tickets_sold;
                if (parseInt(availableTickets.textContent) === 0) {
                    buyTicketButton.textContent = 'Sold Out';
                    buyTicketButton.disabled = true;
                }
            })
            .catch(error => {
                console.error('Error buying ticket:', error);
            });

            fetch("https://code-challenge-3-7spb.onrender.com/films/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    film_id: movie.id,
                    tickets: 1,
                }),
            })
            .then((res) => res.json())
            .catch(error => {
                console.error('Error buying ticket:', error);
            });
        };

    }

    function deleteMovie(film){
        const deleteBtn = document.getElementById(film.id);

        deleteBtn.addEventListener("click", () => {
            fetch(`https://code-challenge-3-7spb.onrender.com/films/${film.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .catch(error => {
                console.error('Error deleting movie:', error);
            });
        });
    }

    fetchAndPopulateMovieList();
});