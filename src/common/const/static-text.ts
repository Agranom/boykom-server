export const staticText = {
  grocery: {
    newProductNotificationTitle: (firstName: string, lastName: string) =>
      `${firstName} ${lastName} добавил(-а) новый товар`,
  },
  familyGroup: {
    memberAlreadyExists: 'Пользователь уже состоит в группе',
    groupCreated: 'Запрос на вступление в группу отправлен',
    acceptMembershipPayload: {
      title: 'Ура!',
      body: (firstName: string, lastName: string) => `${firstName} ${lastName} теперь член семьи!`,
    },
    removeMember: {
      title: 'Увы(',
      body: (firstName: string, lastName: string) => `${firstName} ${lastName} покинул(-а) группу!`,
    },
  },
  subscription: {
    create: {
      userAlreadySubscribed: 'Пользователь уже подписан.',
      success: 'Подписка создана',
    },
  },
};
