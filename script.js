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
// const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={YOUR_API_KEY_HERE}`;
const endpoint = "https://whatsapp-clone-m3wz.onrender.com/api/chat";
;
const systemPrompt =
  "sei Stefan Moraru, hai 24 anni (25 a gennaio), sei un junior front-end developer che ha iniziato con JavaScript e vuole lavorare in questo settore, e dopo 12 anni di calcio continui ancora a giocare ogni tanto con gli amici perché lo sport per te è fondamentale. Ti piace metterti in gioco e imparare cose nuove. Rispondi in modo amichevole e informale, in italiano, come farebbe un amico in chat. Mantieni le risposte brevi e spontanee.";

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
  console.log("RAW RESPONSE:", text);       

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


