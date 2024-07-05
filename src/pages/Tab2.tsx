import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/react';
import { Browser } from '@capacitor/browser';
import './Tab2.css';

const Tab2: React.FC = () => {
  const freeBets = [
    { logo: 'https://metaratings.ru/storage/images/7a/54/7a54791342e6c3170f958e3b325f3f81.jpg', name: 'Winline', url: 'https://bonus.betx.su/SpqKkY', description: 'Получите фрибет на 3000 рублей' },
    { logo: 'https://cdn.livesport.ru/l/betting/fonbet-freebet-2000/picture--original.jpg?1690074110', name: 'Fonbet', url: 'https://bonus.betx.su/fl4Rkg', description: 'Фрибет на 2000 рублей при регистрации' },
    { logo: 'https://cdn.livesport.ru/l/betting/pari-freebet-1000-rubley/picture.jpg?1689976687', name: 'Pari', url: 'https://bonus.betx.su/p4iD8B', description: '1000 рублей новым клиентам' },
    { logo: 'https://www.vseprosport.ru/images/bonus/2259db4dde375bf6840a68357128bec764196dd7e7df5.jpg?v=1688646646', name: 'Melbet', url: 'https://bonus.betx.su/OaBPlc', description: 'Получите фрибет до 3000 рублей' },
    { logo: 'https://static.legalcdn.org/85/68/63240c85ac4bf_1663306885-1200x900.jpeg', name: 'БалтБет', url: 'https://bonus.betx.su/YuhTNx', description: '1000 рублей новым игрокам' },
  ];

  const openUrl = async (url: string) => {
    await Browser.open({ url, presentationStyle: 'fullscreen' });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Фрибеты</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Фрибеты</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="freebets-container">
          {freeBets.map((freeBet, index) => (
            <IonCard key={index} className="freebet-card">
              <IonCardHeader>
                <IonCardTitle className="freebet-title">{freeBet.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="freebet-content">
                <img src={freeBet.logo} alt={`${freeBet.name} logo`} className="freebet-logo" />
                <p className="freebet-description">{freeBet.description}</p>
                <IonButton onClick={() => openUrl(freeBet.url)} expand="full" className="freebet-button">
                  Перейти на сайт
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
