import { useEffect } from 'react';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { notificationsService } from '../services/notificationsService';
import { useAuth } from '../contexts/AuthContext';

export function useNotificationObserver() {
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    void notificationsService.ensurePermissions();
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    function abrirRota(response: Notifications.NotificationResponse | null) {
      const rota = notificationsService.rotaDaResposta(response);
      if (!rota) {
        return;
      }
      if (rota === '/prontuarios' && profile?.tipo !== 'VETERINARIO') {
        router.push('/pets');
        return;
      }
      router.push(rota);
    }

    void Notifications.getLastNotificationResponseAsync().then(async (response) => {
      abrirRota(response);
      if (response) {
        await Notifications.clearLastNotificationResponseAsync();
      }
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(abrirRota);
    return () => subscription.remove();
  }, [user, profile?.tipo]);
}
