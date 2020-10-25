function splash_img(elem, img) {
    let coords = getCoords(elem);
    let c = document.createElement('canvas');
    let ctx = c.getContext('2d');

    const render = (width, height, img) => {
        requestAnimationFrame(() => render(width, height, img));
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = ctx.opacity;
        if (!img.nofade) {
            ctx.opacity -= 0.01;
        }
        let base_image = new Image();
        base_image.src = img.path;
        // TODO offset devrait etre configurable
        ctx.drawImage(base_image, 50, 50, img.width, img.height);
        delete base_image;
        return ctx;
    };

    c.style.position = 'absolute';
    c.style.left = coords.left - 100 + 'px';
    c.style.top = coords.top - 100 + 'px';
    c.style.pointerEvents = 'none';
    c.style.width = 200 + 'px';
    c.style.height = 200 + 'px';
    c.style.zIndex = 100;
    c.width = 200;
    c.height = 200;
    c.style.zIndex = "9999999";
    ctx.opacity = 1.0;
    document.body.appendChild(c);

    render(c.width, c.height, img);
    if (!img.timeout) {
        img.timeout = 1000;
    }
    setTimeout(() => document.body.removeChild(c), img.timeout);
}

function splash(elem, text) {
    {
        let coords = getCoords(elem);
        const colors = ['#ffc000', '#ff3b3b', '#ff8400'];
        const bubbles = 25;

        const explode = (x, y, text) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.style.position = 'absolute';
            c.style.left = x - 100 + 'px';
            c.style.top = y - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = 200 + 'px';
            c.style.height = 200 + 'px';
            c.style.zIndex = 100;
            c.width = 200 * ratio;
            c.height = 200 * ratio;
            c.style.zIndex = "9999999"
            ctx.textY = c.height / 2;
            document.body.appendChild(c);

            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    x: c.width / 2,
                    y: c.height / 2,
                    radius: r(20, 30),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: r(0, 360, true),
                    speed: r(8, 12),
                    friction: 0.9,
                    opacity: r(0, 0.5, true),
                    yVel: 0,
                    gravity: 0.1
                });

            }

            render(particles, ctx, c.width, c.height, text);
            setTimeout(() => document.body.removeChild(c), 1000);
        };

        const render = (particles, ctx, width, height, text) => {
            requestAnimationFrame(() => render(particles, ctx, width, height, text));
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
            ctx.font = 'bold 48px serif';
            ctx.fillStyle = 'black';
            ctx.fillText(text, width / 4, ctx.textY);
            ctx.textY += height / 100;
            particles.forEach((p, i) => {
                p.x += p.speed * Math.cos(p.rotation * Math.PI / 180);
                p.y += p.speed * Math.sin(p.rotation * Math.PI / 180);

                p.opacity -= 0.01;
                p.speed *= p.friction;
                p.radius *= p.friction;
                p.yVel += p.gravity;
                p.y += p.yVel;

                if (p.opacity < 0 || p.radius < 0) return;

                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
                ctx.fill();
            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top, text);
    }
}


function splash_heal(elem, text) {
    {
        let coords = getCoords(elem);
        const colors = ['#ff4f65', '#ff5a73', '#ff5479', '#c0392b'];
        const bubbles = 15;

        const explode = (x, y, text) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.style.position = 'absolute';
            c.style.left = x - 100 + 'px';
            c.style.top = y - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = 200 + 'px';
            c.style.height = 200 + 'px';
            c.style.zIndex = 100;
            c.width = 200 * ratio;
            c.height = 200 * ratio;
            c.style.zIndex = "9999999"
            let startY = c.height * 6 / 10;
            ctx.textY = startY;
            document.body.appendChild(c);


            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    x: r(c.width / 2 - c.width * 0.2, c.width / 2 + c.width * 0.2),
                    y: r(startY * 0.9, startY * 1.2),
                    radius: r(20, 40),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: r(2, 3),
                    opacity: r(0.5, 1, true),
                });

            }

            render(particles, ctx, c.width, c.height, text);
            setTimeout(() => document.body.removeChild(c), 1000);
        };

        const render = (particles, ctx, width, height, text) => {
            requestAnimationFrame(() => render(particles, ctx, width, height, text));
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
            ctx.font = 'bold 48px serif';
            ctx.fillStyle = '#8B0000';
            ctx.fillText(text, width / 4, ctx.textY);
            ctx.textY -= height / 100;
            particles.forEach((p, i) => {
                var x = p.x;
                var y = p.y;
                var width = p.radius;
                var height = p.radius;

                p.y -= p.speed;
                //p.x += p.speed * Math.sin(p.rotation * Math.PI / 180);

                p.opacity -= 0.01;

                if (p.opacity < 0 || p.radius < 0) return;

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                var topCurveHeight = height * 0.3;
                ctx.moveTo(x, y + topCurveHeight);
                // top left curve
                ctx.bezierCurveTo(
                    x, y,
                    x - width / 2, y,
                    x - width / 2, y + topCurveHeight
                );

                // bottom left curve
                ctx.bezierCurveTo(
                    x - width / 2, y + (height + topCurveHeight) / 2,
                    x, y + (height + topCurveHeight) / 2,
                    x, y + height
                );

                // bottom right curve
                ctx.bezierCurveTo(
                    x, y + (height + topCurveHeight) / 2,
                    x + width / 2, y + (height + topCurveHeight) / 2,
                    x + width / 2, y + topCurveHeight
                );

                // top right curve
                ctx.bezierCurveTo(
                    x + width / 2, y,
                    x, y,
                    x, y + topCurveHeight
                );

                ctx.closePath();
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();

            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top, text);
    }
}

function splash_rage(elem, text) {
    {
        let coords = getCoords(elem);
        const colors = ['#740001', '#ae0001', '#eeba30', '#d3a625', '#000000'];
        const bubbles = 20;

        const explode = (x, y, text) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.style.position = 'absolute';
            c.style.left = x - 100 + 'px';
            c.style.top = y - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = 200 + 'px';
            c.style.height = 200 + 'px';
            c.style.zIndex = 100;
            c.width = 200 * ratio;
            c.height = 200 * ratio;
            c.style.zIndex = "9999999"
            let startY = c.height * 6 / 10;
            ctx.textY = startY;
            document.body.appendChild(c);


            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    x: r(c.width / 2 - c.width * 0.2, c.width / 2 + c.width * 0.2),
                    y: r(startY * 0.9, startY * 1.2),
                    radius: r(20, 40),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: r(2, 3),
                    opacity: r(0.5, 1, true),
                });

            }

            render(particles, ctx, c.width, c.height, text);
            setTimeout(() => document.body.removeChild(c), 1000);
        };

        const render = (particles, ctx, width, height, text) => {
            requestAnimationFrame(() => render(particles, ctx, width, height, text));
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
            ctx.font = 'bold 48px serif';
            ctx.fillStyle = 'black';
            ctx.fillText(text, width / 4, ctx.textY);
            ctx.textY -= height / 100;
            particles.forEach((p, i) => {
                var x = p.x;
                var y = p.y;
                var width = p.radius;
                var height = p.radius;

                p.y -= p.speed;
                //p.x += p.speed * Math.sin(p.rotation * Math.PI / 180);

                p.opacity -= 0.01;

                if (p.opacity < 0 || p.radius < 0) return;

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                var topCurveHeight = height * 0.3;
                ctx.moveTo(x, y + topCurveHeight);

                ctx.beginPath();
                ctx.strokeRect(r(60, 120), r(50, 120), r(1, 10), r(1, 10));

                ctx.stroke();
                ctx.closePath();
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();

            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top, text);
    }
}

function splash_feuint(elem, text) {
    {
        let coords = getCoords(elem);
        const colors = ['#FC791C', '#E34000', '#A62002', '#d3a625', '#821E00'];
        const bubbles = 20;

        const explode = (x, y, text) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.style.position = 'absolute';
            c.style.left = x - 100 + 'px';
            c.style.top = y - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = 200 + 'px';
            c.style.height = 200 + 'px';
            c.style.zIndex = 100;
            c.width = 200 * ratio;
            c.height = 200 * ratio;
            c.style.zIndex = "9999999"
            let startY = c.height * 6 / 10;
            ctx.textY = startY;
            document.body.appendChild(c);


            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    x: r(c.width / 2 - c.width * 0.2, c.width / 2 + c.width * 0.2),
                    y: r(startY * 0.9, startY * 1.2),
                    radius: r(20, 40),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: r(2, 3),
                    opacity: r(0.5, 1, true),
                });

            }

            render(particles, ctx, c.width, c.height, text);
            setTimeout(() => document.body.removeChild(c), 1000);
        };

        const render = (particles, ctx, width, height, text) => {
            requestAnimationFrame(() => render(particles, ctx, width, height, text));
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
            ctx.font = 'bold 35px serif';
            ctx.fillStyle = 'black';
            ctx.fillText(text, width / 4, ctx.textY);
            ctx.textY -= height / 100;
            particles.forEach((p, i) => {
                var x = p.x;
                var y = p.y;
                var width = p.radius;
                var height = p.radius;

                p.y -= p.speed;
                //p.x += p.speed * Math.sin(p.rotation * Math.PI / 180);

                p.opacity -= 0.01;

                if (p.opacity < 0 || p.radius < 0) return;

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                var topCurveHeight = height * 0.3;
                ctx.moveTo(x, y + topCurveHeight);

                ctx.beginPath();


                ctx.arc(r(80, 120), r(25, 125), r(3, 10), 0, 2 * Math.PI);

                ctx.stroke();
                ctx.closePath();
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();

            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top, text);
    }
}
function splash_flash(elem) {
    {
        let coords = getCoords(elem);
        const colors = ['#fff'];
        const bubbles = 20;

        const explode = (x, y) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.style.position = 'absolute';
            c.style.left = x - 100 + 'px';
            c.style.top = y - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = 200 + 'px';
            c.style.height = 200 + 'px';
            c.style.zIndex = 100;
            c.width = 200 * ratio;
            c.height = 200 * ratio;
            c.style.zIndex = "9999999"
            let startY = c.height * 6 / 10;
            ctx.textY = startY;
            document.body.appendChild(c);


            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    x: r(c.width / 2 - c.width * 0.2, c.width / 2 + c.width * 0.2),
                    y: r(startY * 0.9, startY * 1.2),
                    radius: r(20, 40),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: r(2, 3),
                    opacity: r(0.5, 1, true),
                });

            }

            render(particles, ctx, c.width, c.height);
            setTimeout(() => document.body.removeChild(c), 1000);
        };

        const render = (particles, ctx, width, height) => {
            requestAnimationFrame(() => render(particles, ctx, width, height));
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, i) => {
                var x = p.x;
                var y = p.y;
                var width = p.radius;
                var height = p.radius;

                p.y -= p.speed;
                //p.x += p.speed * Math.sin(p.rotation * Math.PI / 180);

                p.opacity -= 0.01;

                if (p.opacity < 0 || p.radius < 0) return;

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                var topCurveHeight = height * 0.3;
                ctx.moveTo(x, y + topCurveHeight);

                ctx.beginPath();
                ctx.strokeRect(r(60, 140), r(50, 140), r(1, 6), r(1, 6));

                ctx.closePath();
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();

            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top);
    }
}
function splash_invo(elem) {
    {
        let coords = getCoords(elem);
        const colors = ['#394053', '#4E4A59', '#6E6362', '#839073', '#7CAE7A'];
        const bubbles = 50;

        const explode = (x, y) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.style.position = 'absolute';
            c.style.left = x - 100 + 'px';
            c.style.top = y - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = 200 + 'px';
            c.style.height = 200 + 'px';
            c.style.zIndex = 100;
            c.width = 200 * ratio;
            c.height = 200 * ratio;
            c.style.zIndex = "9999999"
            let startY = c.height * 6 / 10;
            ctx.textY = startY;
            document.body.appendChild(c);


            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    x: r(c.width / 2 - c.width * 0.2, c.width / 2 + c.width * 0.2),
                    y: r(startY * 0.9, startY * 1.2),
                    radius: r(20, 40),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: r(2, 3),
                    opacity: r(0.5, 1, true),
                });

            }

            render(particles, ctx, c.width, c.height);
            setTimeout(() => document.body.removeChild(c), 1000);
        };

        const render = (particles, ctx, width, height) => {
            requestAnimationFrame(() => render(particles, ctx, width, height));
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, i) => {
                var x = p.x;
                var y = p.y;
                var width = p.radius;
                var height = p.radius;

                p.y -= p.speed;
                //p.x += p.speed * Math.sin(p.rotation * Math.PI / 180);

                p.opacity -= 0.01;

                if (p.opacity < 0 || p.radius < 0) return;

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                var topCurveHeight = height * 0.3;
                ctx.moveTo(x, y + topCurveHeight);

                ctx.beginPath();
                ctx.strokeRect(r(50, 140), r(50, 140), r(1, 20), r(1, 20));

                ctx.closePath();
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();

            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top);
    }
}


function splash_projectile(elem, elemCible, img) {
    //EXEMPLE splash_projectile($("#9")[0], $("#39")[0], {path:"img/arti.png", width: 50, height:50, nb:15})
    {
        let coords = getCoords(elem);
        let coordsCible = getCoords(elemCible);
        const bubbles = img.nb; //nb de projectiles 10k c'est trop



        const explode = (x, y, xCible, yCible, img) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');
            let xCanva = 100;
            let yCanva = 100;
            let xCanvaArr = 100;
            let yCanvaArr = 100;

            c.style.position = 'absolute';
            c.style.left = Math.min(x, xCible) - 100 + 'px';
            c.style.top = Math.min(y, yCible) - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = Math.max(x, xCible) - Math.min(x, xCible) + 200 + 'px';
            c.style.height = Math.max(y, yCible) - Math.min(y, yCible) + 200 + 'px';
            c.style.zIndex = 100;
            c.width = (Math.max(x, xCible) - Math.min(x, xCible) + 200) * ratio;
            c.height = (Math.max(y, yCible) - Math.min(y, yCible) + 200) * ratio;
            c.style.zIndex = "9999999"
            document.body.appendChild(c);


            if (x > xCible) {
                xCanva = c.width - 100;
                xCanvaArr = 100;
            }
            else xCanvaArr = c.width - 100;
            if (y > yCible) {
                yCanva = c.height - 100;
                yCanvaArr = 100;
            }
            else yCanvaArr = c.height - 100;

            var dx = (xCible - x);
            var dy = (yCible - y);

            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    dx: dx,
                    dy: dy,

                    x: xCanva, // pos de depart, legerement randomisable
                    y: yCanva, // pos de depart, legerement randomisable
                    xArr: xCanvaArr, // pos d'arrivee, legerement randomisable
                    yArr: yCanvaArr, // pos d'arrivee, legerement randomisable

                    delay: r(0, 5),
                    speed: r(0.04, 0.08, 3), // randomisable
                    opacity: 1, // randomisable
                });

            }

            render(particles, ctx, c.width, c.height, img);
            setTimeout(() => document.body.removeChild(c), 1500); // temps d'animation au bout duquel tout est delete
        };

        const render = (particles, ctx, width, height, img) => {
            requestAnimationFrame(() => render(particles, ctx, width, height, img));
            ctx.clearRect(0, 0, width, height);
            // ctx.globalAlpha = 1.0;
            // ctx.font = 'bold 48px serif';
            // ctx.fillStyle = 'black';
            // ctx.fillText(text, width / 4, ctx.textY);
            // ctx.textY -= height / 100;
            particles.forEach((p, i) => {
                p.delay--;
                if (p.delay > 0) {
                    return;
                }
                p.x = p.x + p.dx * p.speed;
                p.y = p.y + p.dy * p.speed;

                //p.opacity -= 0.01;
                if (p.dx > 0 && p.x > p.xArr) {
                    return;
                }
                if (p.dx < 0 && p.x < p.xArr) {
                    return;
                }
                if (p.dy > 0 && p.y > p.yArr) {
                    return;
                }
                if (p.dy < 0 && p.y < p.yArr) {
                    return;
                }
                let base_image = new Image();
                base_image.src = img.path;
                // TODO offset et size devrait etre configurable
                ctx.drawImage(base_image, p.x - img.width / 2, p.y - img.height / 2, img.width, img.height); // (base_image, p.x, p.y, LARGEUR, HAUTEUR)
                delete base_image;
            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top, coordsCible.left, coordsCible.top, img);
    }
}

function splash_pm(elem, text) {
    {
        let coords = getCoords(elem);
        const colors = ['#42612B', '#569629', '#59EB2D', '#9FFF6B', '#7DFF81'];
        const bubbles = 10;

        const explode = (x, y, text) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.style.position = 'absolute';
            c.style.left = x - 100 + 'px';
            c.style.top = y - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = 200 + 'px';
            c.style.height = 200 + 'px';
            c.style.zIndex = 100;
            c.width = 200 * ratio;
            c.height = 200 * ratio;
            c.style.zIndex = "9999999"
            let startY = c.height * 6 / 10;
            ctx.textY = startY;
            document.body.appendChild(c);


            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    x: r(c.width / 2 - c.width * 0.2, c.width / 2 + c.width * 0.2),
                    y: r(startY * 0.9, startY * 1.2),
                    radius: r(20, 40),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: r(2, 3),
                    opacity: r(0.5, 1, true),
                });

            }

            render(particles, ctx, c.width, c.height, text);
            setTimeout(() => document.body.removeChild(c), 1000);
        };

        const render = (particles, ctx, width, height, text) => {
            requestAnimationFrame(() => render(particles, ctx, width, height, text));
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
            ctx.font = 'bold 30px serif';
            ctx.fillStyle = '#273919';
            ctx.fillText(text, width / 4, ctx.textY);
            ctx.textY -= height / 100;
            particles.forEach((p, i) => {
                var x = p.x;
                var y = p.y;
                var width = p.radius;
                var height = p.radius;

                p.y -= p.speed;
                //p.x += p.speed * Math.sin(p.rotation * Math.PI / 180);

                p.opacity -= 0.01;

                if (p.opacity < 0 || p.radius < 0) return;

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                var topCurveHeight = height * 0.3;
                ctx.moveTo(x, y + topCurveHeight);

                ctx.beginPath();


                ctx.arc((r(60, 140)), r(85, 125), r(3, 10), 0, 2 * Math.PI);

                ctx.stroke();
                ctx.closePath();
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();

            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top, text);
    }
}

function splash_PA(elem, text) {
    {
        let coords = getCoords(elem);
        const colors = ['#65AFFF', '#335C81', '#274060', '#5899E2', '#1B2845'];
        const bubbles = 10;

        const explode = (x, y, text) => {
            let particles = [];
            let ratio = window.devicePixelRatio;
            let c = document.createElement('canvas');
            let ctx = c.getContext('2d');

            c.style.position = 'absolute';
            c.style.left = x - 100 + 'px';
            c.style.top = y - 100 + 'px';
            c.style.pointerEvents = 'none';
            c.style.width = 200 + 'px';
            c.style.height = 200 + 'px';
            c.style.zIndex = 100;
            c.width = 200 * ratio;
            c.height = 200 * ratio;
            c.style.zIndex = "9999999"
            let startY = c.height * 6 / 10;
            ctx.textY = startY;
            document.body.appendChild(c);


            for (var i = 0; i < bubbles; i++) {
                particles.push({
                    x: r(c.width / 2 - c.width * 0.2, c.width / 2 + c.width * 0.2),
                    y: r(startY * 0.9, startY * 1.2),
                    radius: r(20, 40),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: r(2, 3),
                    opacity: r(0.5, 1, true),
                });

            }

            render(particles, ctx, c.width, c.height, text);
            setTimeout(() => document.body.removeChild(c), 1000);
        };

        const render = (particles, ctx, width, height, text) => {
            requestAnimationFrame(() => render(particles, ctx, width, height, text));
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
            ctx.font = 'bold 30px serif';
            ctx.fillStyle = '#1B2845';
            ctx.fillText(text, width / 4, ctx.textY);
            ctx.textY -= height / 100;
            particles.forEach((p, i) => {
                var x = p.x;
                var y = p.y;
                var width = p.radius;
                var height = p.radius;

                p.y -= p.speed;
                //p.x += p.speed * Math.sin(p.rotation * Math.PI / 180);

                p.opacity -= 0.01;

                if (p.opacity < 0 || p.radius < 0) return;

                ctx.save();
                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                var topCurveHeight = height * 0.3;
                ctx.moveTo(x, y + topCurveHeight);

                ctx.beginPath();


                ctx.arc((r(60, 140)), r(85, 125), r(3, 10), 0, 2 * Math.PI);

                ctx.stroke();
                ctx.closePath();
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();

            });

            return ctx;
        };

        const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));
        explode(coords.left, coords.top, text);
    }
}