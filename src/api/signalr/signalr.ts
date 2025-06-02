// src/signalr.ts
import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export const getConnection = () => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7036/roomhub') // เปลี่ยนตามจริง
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  return connection;
};


// https://localhost:7036/roomhub