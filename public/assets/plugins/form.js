"use strict"

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

let $savingLoader = '<div class="spinner-border spinner-border-sm" role="status">' +
    '<span class="visually-hidden">Loading...</span>' +
    '</div>';

function NotifyAlert(type, res, msg = null, destination = null) {
    var background;
    var message;
    var redirect;


    switch (type) {
        case "error":
            background = "radial-gradient(circle at 10% 50.5%, rgb(255, 107, 6) 0%, rgb(255, 1, 107) 90%)";
            message = msg ?? res.message ?? res.responseText ?? 'Oops! Something went wrong';
            destination = destination ?? redirect ?? null;
            break;
        case "success":
            background = "linear-gradient(to right, rgb(0, 176, 155), rgb(150, 201, 61))";
            message = msg ?? res.message ?? 'Congratulate! Operation Successful.';
            destination = destination ?? redirect ?? null;
            break;
        case "warning":
            background = "linear-gradient(135deg, rgb(252, 207, 49) 10%, rgb(245, 85, 85) 100%)";
            message = msg ?? res.message ?? res.responseJSON.message ?? 'Warning! Operation Failed.';
            destination = destination ?? redirect ?? null;
            break;
        default:

    }

    Toastify({
        text: message,
        destination: destination,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: background,
        }
    }).showToast();
}

function congratulations() {
    var count = 200;
    var defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });


}

function congratulationsPride() {
    var end = Date.now() + (1 * 1000);
    var colors = ['#825ee4', '#5e72e4'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);

        }
    }());
}