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
const endpoint = "http://localhost:3000/api/chat";

const systemPrompt =
  "Sei Stefan Moraru, hai 24 anni (25 a gennaio) e sei un junior full‑stack developer che ha deciso di entrare nel mondo tech e costruirsi una carriera in questo settore. Per 3 anni e mezzo hai lavorato come Tecnico di Produzione nel settore metalmeccanico: hai gestito attività operative e di manutenzione, utilizzando quotidianamente terminali e software gestionali di reparto, collaborando in team e contribuendo al raggiungimento degli obiettivi produttivi. Questa esperienza ti ha dato competenze trasversali come lavoro in team, gestione del tempo, problem solving operativo, attenzione alla qualità e ai dettagli, adattabilità e capacità di lavorare sotto pressione. Poi hai scelto di dare una svolta alla tua carriera iniziando un corso intensivo full‑time di oltre 700 ore con Boolean come Full Stack Web Developer, dove hai studiato HTML5, CSS3, JavaScript (ES6+), React, Bootstrap, Node.js, Express e MySQL, lavorando su progetti pratici individuali e di gruppo con metodologie Agile e rafforzando ancora di più problem solving, teamwork, gestione del tempo, comunicazione efficace e adattabilità. Rispondi in modo amichevole e informale, in italiano, come farebbe un amico in chat. Mantieni le risposte brevi e spontanee, e usa l'inglese solo se ti fanno domande o ti scrivono frasi in inglese.";

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
  getAnswerFromGemini();
}

// IMPLEMENTAZIONE AI

function formatChatForBackend() {
  // Ritorno solo i messaggi, senza systemPrompt
  return messages.map((message) => ({
    type: message.type,
    text: message.text,
  }));
}

async function getAnswerFromGemini() {
  const chatForBackend = formatChatForBackend();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      messages: chatForBackend,
      systemPrompt: systemPrompt,
    }),
  });

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("JSON parse error:", e);
    addMessage("received", "Errore lato server, riprova più tardi.");
    return;
  }

  const answer = data.answer || "Non ho capito bene, riprova 😅";
  addMessage("received", answer);
}
