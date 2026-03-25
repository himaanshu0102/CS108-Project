let x=0;
let y=0;

window.addEventListener('keydown', (event) => {

        if (event.key === "d" || event.key === 'ArrowRight') {
                document.getElementById(String(x)+String(y)).innerText='█';
                if (x < 8) {
                        x++;
                }
        }
        if (event.key === "a" || event.key === 'ArrowLeft') {
                document.getElementById(String(x)+String(y)).innerText='█';
                if (x > 0) {
                        x--;
                }
        }
        if (event.key === "w" || event.key === 'ArrowUp') {
                document.getElementById(String(x)+String(y)).innerText='█';
                if (y > 0) {
                        y--;
                }
        }
        if (event.key === "s" || event.key === 'ArrowDown') {
                document.getElementById(String(x)+String(y)).innerText='█';
                if (y < 8) {
                        y++;
                }
        }

        document.getElementById(String(x)+String(y)).innerText='..';

});
