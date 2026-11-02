import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationRoute = '/pets' | '/prontuarios';

function isNotificationRoute(value: unknown): value is NotificationRoute {
  return value === '/pets' || value === '/prontuarios';
}

export const notificationsService = {
  async ensurePermissions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('clyvet-clinico', {
        name: 'Acompanhamento clínico',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    const atual = await Notifications.getPermissionsAsync();
    let status = atual.status;
    if (status !== 'granted') {
      const pedido = await Notifications.requestPermissionsAsync();
      status = pedido.status;
    }
    return status === 'granted';
  },

  async avisarPetCadastrado(nome: string) {
    const permitido = await this.ensurePermissions();
    if (!permitido) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Acompanhamento clínico',
        body: `${nome} foi cadastrado. Toque para conferir o alerta preventivo.`,
        data: { route: '/pets' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });
  },

  async avisarProntuarioRegistrado() {
    const permitido = await this.ensurePermissions();
    if (!permitido) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Retorno clínico',
        body: 'Novo diagnóstico salvo. Toque para revisar o histórico do pet.',
        data: { route: '/prontuarios' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });
  },

  rotaDaResposta(response: Notifications.NotificationResponse | null) {
    const route = response?.notification.request.content.data?.route;
    return isNotificationRoute(route) ? route : null;
  },
};
