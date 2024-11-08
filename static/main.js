/**
 * Returns the current datetime for the message creation.
 */
function getCurrentTimestamp() {
	return new Date();
}

/**
 * Renders a message on the chat screen based on the given arguments.
 * This is called from the `showUserMessage` and `showBotMessage`.
 */
function renderMessageToScreen(args) {
	// local variables
	let displayDate = (args.time || getCurrentTimestamp()).toLocaleString('en-IN', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	});
	let messagesContainer = $('.messages');

	// init element
	let message = $(`
	<li class="message ${args.message_side}">
		<div class="avatar"></div>
		<div class="text_wrapper">
			<div class="text">${args.text}</div>
			<div class="timestamp">${displayDate}</div>
		</div>
	</li>
	`);

	// add to parent
	messagesContainer.append(message);

	// animations
	setTimeout(function () {
		message.addClass('appeared');
	}, 0);
	messagesContainer.animate({ scrollTop: messagesContainer.prop('scrollHeight') }, 300);
}

/* Sends a message when the 'Enter' key is pressed.
 */
$(document).ready(function() {
    $('#msg_input').keydown(function(e) {
        // Check for 'Enter' key
        if (e.key === 'Enter') {
            // Prevent default behaviour of enter key
            e.preventDefault();
			// Trigger send button click event
            $('#send_button').click();
        }
    });
});

/**
 * Displays the user message on the chat screen. This is the right side message.
 */
function showUserMessage(message, datetime) {
	renderMessageToScreen({
		text: message,
		time: datetime,
		message_side: 'right',
	});
}

/**
 * Displays the chatbot message on the chat screen. This is the left side message.
 */
function showBotMessage(message, datetime) {
	renderMessageToScreen({
		text: message,
		time: datetime,
		message_side: 'left',
	});
}

/**
 * Get input from user and show it on screen on button click.
 */
$('#send_button').on('click', function (e) {
    // Obtener el mensaje del input
    let userMessage = $('#msg_input').val();

    // Mostrar el mensaje del usuario en el chat
    showUserMessage(userMessage);

    // Limpiar el campo de input
    $('#msg_input').val('');

    // Obtener el thread_id de sessionStorage, si existe
    let threadId = sessionStorage.getItem('threadId');

    // Crear el cuerpo de la solicitud
    let requestBody = {
        query: userMessage,
    };

    // Si hay un thread_id, agregarlo al cuerpo de la solicitud
    if (threadId) {
        requestBody.thread_id = threadId;
    }
	console.log('SOY REQUESTBODY', requestBody);
	
    // Realizar el POST al backend con el mensaje del usuario y el thread_id si está disponible
    fetch(config.backendUrl, {
        method: 'POST',
        headers: {
			'Content-Type': 'application/json',
			'x-access-token': config.accessToken
		},
        body: JSON.stringify(requestBody), 
    })
    .then(response => response.json())  // Convertir la respuesta a JSON
    .then(data => {
		console.log(data);

        // Guardar el thread_id en sessionStorage si está presente en la respuesta
        if (data.thread_id) {
            sessionStorage.setItem('threadId', data.thread_id);
        }

        // Mostrar la respuesta del backend como mensaje del bot
        showBotMessage(data.message);
    })
    .catch(error => {
        // Manejar cualquier error de la solicitud
        console.error('Error:', error);
        showBotMessage('Error al comunicarse con el servidor.');
    });
});

/**
 * Set initial bot message to the screen for the user.
 */
$(window).on('load', function () {
	showBotMessage('Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?');
});

// Limpiar el thread_id de sessionStorage cuando la página se refresca
window.addEventListener('beforeunload', function () {
    sessionStorage.removeItem('threadId');
});
