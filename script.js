//Recupero gli elementi dal DOM
const input = document.querySelector("input");
const button = document.querySelector("button");
const chatBox = document.querySelector(".chat-box");

//Preparazione dei messaggi iniziali
const messages = [
  {
    type: "sent",
    text: "Ciao come va?",
    time: "26/11/2025 11:43:00",
  },
  {
    type: "received",
    text: "Tutto bene, grazie. E tu?",
    time: "26/11/2025 11:53:00",
  },
];

//Operazioni di Avvio Pagina
showMessages();

//Operazioni di interazione con l'utente
button.addEventListener("click", sendMessage);

//Alla pressione del tasto invio
input.addEventListener("keydown", function (event) {
    //Controllo se il tasto cliccato è 'Invio'
    if(event.key === 'Enter') sendMessage()
});

//FUNZIONI UTILI

//Fuzione per mostrare i messaggi in pagina
function showMessages() {
  //Svuoto la chat
  chatBox.innerHTML = "";

  for (const message of messages) {
    chatBox.innerHTML += `
      <div class="chat-row ${message.type}">
        <div class="chat-message">
          <p>${message.text}</p>
          <time datetime="${message.time}">${message.time}</time>
        </div>
      </div>
    `;
  }
}

//Funzione per aggiungere un messaggio
function addMessage(messageType, messageText) {
  //Creo un nuovo messaggio
  const newMessage = {
    type: messageType,
    text: messageText,
    time: new Date().toLocaleString(),
  };

  //Aggiungo il messaggio nuovo alla lista dei messaggi
  messages.push(newMessage);

  showMessages();
}

//Funzione per inviare un messaggio
function sendMessage() {
  //Recupero il testo inserito dall'utente
  const insertedText = input.value.trim();

  //Se non c'è testo, annullo tutto
  if (insertedText === "") return;

  addMessage("sent", insertedText);

  //Svuoto la casella di testo
  input.value = "";
  //Riporto il cursone sulla casella
  input.focus();

  //Scorro in automatico alla fine del box
  chatBox.scrollTop = chatBox.scrollHeight;
}
