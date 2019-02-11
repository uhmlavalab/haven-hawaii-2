import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class DatabaseSqlService {

  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private http: Http) { }

  public getCapactiyData(scenario: number): Promise<any> {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.onload = () => {
        const results = JSON.parse(req.responseText) as any;
        Object.keys(results).forEach(el1 => {
          const elData = [];
          Object.keys(results[el1]).forEach(el2 => {
            elData.push([el2, results[el1][el2]]);
          })
          results[el1] = elData;
        })
        console.log(results);
        return resolve(results);
      }
      req.onerror = () => {
        return reject('There was an error');
      }
      req.open('GET', `https://us-central1-haven-hawaii-2.cloudfunctions.net/capacityData?scenario=${scenario}`, true);
      req.send();
    })

  }

  public getGenerationData(scenario: number, year: number, scale: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.onload = () => {
        const data = {};
        const results = JSON.parse(req.responseText) as any;
        let time = null;
        results.rows.forEach(el => {
          if (!data[el.technology]) {
            data[el.technology] = [];
          }
          (scale == 'months') ? time = this.monthsOfYear[el['time'] - 1] : time = el['time'];
          data[el.technology].push([time, el['sum']]);
        })
        console.log(data);
        return resolve(data);
      }
      req.onerror = () => {
        return reject('There was an error');
      }
      req.open('GET', `https://us-central1-haven-hawaii-2.cloudfunctions.net/generationData?year=${year}&scenario=${scenario}&scale=${scale}`, true);
      req.send();
    });
  }

  public getDemandData(scenario: number, year: number, scale: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.onload = () => {
        const data = {};
        const results = JSON.parse(req.responseText) as any;
        let time = null;
        console.log(results);
        results.rows.forEach(el => {
          if (!data[el.technology]) {
            data[el.technology] = [];
          } 
          (scale == 'months') ? time = this.monthsOfYear[el['time'] - 1] : time = el['time'];
          data[el.technology].push([time, -el['sum']]);
        })
        console.log(data);
        return resolve(data);
      }
      req.onerror = () => {
        return reject('There was an error');
      }
      req.open('GET', `https://us-central1-haven-hawaii-2.cloudfunctions.net/demandData?year=${year}&scenario=${scenario}&scale=${scale}`, true);
      req.send();
    });
  }

  public getSolarTotalYear(scenario: number, year: number): Promise<any> {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.onload = () => {
        const results = JSON.parse(req.responseText) as any;
        return resolve(Number(results.rows[0].sum));
      }
      req.onerror = () => {
        return reject('There was an error');
      }
      req.open('GET', `https://us-central1-haven-hawaii-2.cloudfunctions.net/solarTotalYear?scenario=${scenario}&year=${year}`, true);
      req.send();
    })

  }

}


