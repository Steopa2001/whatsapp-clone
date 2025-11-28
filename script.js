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

//Preparo l'indirizzo da chiamare per le API
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyB484pGiJvh-Hya170oko3-foH3lh6hmf0`;
const systemPrompt =
  "Sei Stefan Moraru e hai 24 anni, il 9 gennaio 2026 ne avrai 25. Sei un amico che risponde in modo amichevole e informale. Sei uno sviluppatore front-end alle prime armi che ha imparato JavaScript come primo linguaggio. Sei determinato a lavorare in questo settore e ti piace lo sport: hai giocato a calcio per 12 anni e ora ogni tanto giochi ancora con gli amici. Rispondi in modo amichevole e informale, in italiano, come farebbe un amico in chat. Mantieni le risposte brevi e spontanee.";

//Operazioni di Avvio Pagina
showMessages();

//Operazioni di interazione con l'utente
button.addEventListener("click", sendMessage);

//Alla pressione del tasto invio
input.addEventListener("keydown", function (event) {
  //Controllo se il tasto cliccato è 'Invio'
  if (event.key === "Enter") sendMessage();
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
    //Riporto il cursone sulla casella
  input.focus();

  //Scorro in automatico alla fine del box
  chatBox.scrollTop = chatBox.scrollHeight;

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

  //Chiedo a Gemini di generare una risposta
  getAnswerFromGemini()
}

// IMPLEMENTAZIONE AI

//funzione per formattare la chat in un formato gradito a Gemini
function formatChatForGemini() {
  //Preparo un array per la "Nuova Chat"
  const formattedChat = [];

  for (const message of messages) {
    //Creo e aggiungo un nuovo oggetto alla mia chat formattata
    formattedChat.
      push({
        parts: [{ text: message.text }],
        role: message.type === "sent" ? "user" : "model",
      });
  }

  //Aggiungo il systemPrompt all'inizio dell'array
  formattedChat.unshift({
    role: "user",
    parts: [{ text: systemPrompt }],
  });

  return formattedChat;
}

//Funzione per chiedere a Gemini di generare una risposta
async function getAnswerFromGemini() {
  //Prepariamo la chat da inviare
  const chatForGemini = formatChatForGemini();

  //Effettuiamo la chiamata API di Gemini
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ contents: chatForGemini }),
  });

  //Riconverto la risposta dal json 
  const data = await response.json();

  //Recupero il testo effettivo dalla risposta
  const answer = data.candidates[0].content.parts[0].text

  //Aggiungo il messaggio in pagina 
  addMessage('received', answer)
}
