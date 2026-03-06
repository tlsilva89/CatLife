import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';

const CONSULT_AI = gql`
  mutation ConsultAiVet($catId: Int!, $symptoms: String!) {
    consultAiVet(catId: $catId, symptoms: $symptoms)
  }
`;

const LINK_TELEGRAM = gql`
  mutation LinkTelegramAccount($chatId: String!) {
    linkTelegramAccount(chatId: $chatId) {
      id
      chatId
      linkedAt
    }
  }
`;

const GET_TELEGRAM_LINK = gql`
  query GetMyTelegramLink {
    myTelegramLink {
      chatId
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AiVetService {
  private apollo = inject(Apollo);

  async consult(catId: number, symptoms: string): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: CONSULT_AI,
        variables: { catId, symptoms }
      })
    );
    return result.data;
  }

  async linkTelegram(chatId: string): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: LINK_TELEGRAM,
        variables: { chatId }
      })
    );
    return result.data;
  }

  async getTelegramLink(): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.query({
        query: GET_TELEGRAM_LINK,
        fetchPolicy: 'network-only'
      })
    );
    return result.data;
  }
}