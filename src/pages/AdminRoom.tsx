// import { useState, FormEvent } from 'react';
// import { type } from 'os';
import { useParams, useHistory } from 'react-router-dom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss'
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

// import { useAuth } from '../hooks/useAuth';
// import { database } from '../services/firebase';
// import { useEffect } from 'react';
// import firebase from 'firebase';
// import { Link } from 'react-router-dom';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  // const [newQuestion, setNewQuestion] = useState('');
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);

  async function handleEndRoom(){
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

   async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja deletar esta pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
          {/* <Link to="/rooms/-MdNJ8Iu7BaGeC-cabYY">TESTE</Link> */}
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>



        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id} //ALGORITMO DE RECONCILIAÇÃO
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
};