import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { firstValueFrom, map, Observable } from 'rxjs';

const GET_APPOINTMENTS = gql`
  query GetAppointments($catId: Int!) {
    appointments(catId: $catId) {
      id
      type
      dateTime
      location
    }
  }
`;

const ADD_APPOINTMENT = gql`
  mutation AddAppointment($input: AddAppointmentInput!) {
    addAppointment(input: $input) {
      id
      type
    }
  }
`;

const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($id: Int!, $input: UpdateAppointmentInput!) {
    updateAppointment(id: $id, input: $input) {
      id
      type
    }
  }
`;

const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: Int!) {
    deleteAppointment(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apollo = inject(Apollo);

  getAppointments(catId: number): Observable<any[]> {
    return this.apollo.watchQuery({
      query: GET_APPOINTMENTS,
      variables: { catId },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map((result: any) => result.data?.appointments || [])
    );
  }

  async addAppointment(input: any): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: ADD_APPOINTMENT,
        variables: { input }
      })
    );
    return result.data;
  }

  async updateAppointment(id: number, input: any): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: UPDATE_APPOINTMENT,
        variables: { id, input }
      })
    );
    return result.data;
  }

  async deleteAppointment(id: number): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate({
        mutation: DELETE_APPOINTMENT,
        variables: { id }
      })
    );
    return result.data;
  }
}