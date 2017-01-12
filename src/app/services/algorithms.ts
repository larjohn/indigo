import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Http, RequestMethod} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Cube} from '../models/cube';
import 'rxjs/add/operator/mergeMap';
import {Algorithm} from '../models/analysis/algorithm';
import {Input, InputTypes} from '../models/analysis/input';
import {Output, OutputTypes} from '../models/analysis/output';
import {environment} from '../../environments/environment';

@Injectable()
export class AlgorithmsService {
  private API_DAM_PATH: string = environment.DAMbase + '/cubes';

  constructor(private http: Http) {
  }

  getCompatibleAlgorithms(cube: Cube): Observable<Algorithm[]> {
    let that = this;
    return Observable.create(function (observer: any) {
      observer.next([that.dummyTimeSeries(), that.dummyDescriptiveStatistics()]);
    });


  }

  getActualCompatibleAlgorithms(cube: Cube): Observable<Algorithm[]> {
    let that = this;


    return this.http.get(`${this.API_DAM_PATH}/${cube.name}/algo`)
      .map(res => {

        let response = res.json();


        let algorithms = [];
        for (let algorithmName of response.algos) {
           let algorithm = new Algorithm();
           algorithm.name = algorithmName;
           algorithm.title = algorithmName;
           algorithms.push(algorithm);
        }
        return algorithms;
      });


  }


  getTimeSeriesAlgorithm(): Observable<Algorithm> {
    let that = this;
    return Observable.create(function (observer: any) {
      observer.next(that.dummyTimeSeries());
    });

  }
  getDescriptiveStatisticsAlgorithm(): Observable<Algorithm> {
    let that = this;
    return Observable.create(function (observer: any) {
      observer.next(that.dummyDescriptiveStatistics());
    });
  }

  getAlgorithm(name, cube: Cube): Observable<Algorithm> {
    switch (name) {
      case 'time_series':
        return this.getTimeSeriesAlgorithm();
      case 'descriptive_statistics':
        return this.getDescriptiveStatisticsAlgorithm();
      default:
        return  this.http.get(`${this.API_DAM_PATH}/algo/${name}`)
        .map(res => {

          let response = res.json();



            let algorithm = new Algorithm().deserialize(response);


          return algorithm;
        });


    }

  }


  dummyTimeSeries(): Algorithm {
    let timeSeriesAlgorithm = new Algorithm();
    timeSeriesAlgorithm.title = 'Time Series';
    timeSeriesAlgorithm.name = 'time_series';

    let raw_data_input = new Input();
    raw_data_input.cardinality = '1';
    raw_data_input.type = InputTypes.BABBAGE_AGGREGATE_URI;
    raw_data_input.name = 'json_data';
    raw_data_input.title = 'Data coming from an aggregation';
    raw_data_input.guess = false;
    raw_data_input.required = true;

    let time_dimension_input = new Input();
    time_dimension_input.cardinality = '1';
    time_dimension_input.type = InputTypes.ATTRIBUTE_REF;
    time_dimension_input.name = 'time';
    time_dimension_input.title = 'Time dimension';
    time_dimension_input.guess = true;
    time_dimension_input.required = true;

    let amount_aggregate_input = new Input();
    amount_aggregate_input.cardinality = '1';
    amount_aggregate_input.type = InputTypes.AGGREGATE_REF;
    amount_aggregate_input.name = 'amount';
    amount_aggregate_input.title = 'Amount aggregate';
    amount_aggregate_input.guess = true;
    amount_aggregate_input.required = true;

    let prediction_steps_input = new Input();
    prediction_steps_input.cardinality = '1';
    prediction_steps_input.type = InputTypes.PARAMETER;
    prediction_steps_input.name = 'prediction_steps';
    prediction_steps_input.title = 'Prediction Steps';
    prediction_steps_input.data_type = 'number';
    prediction_steps_input.default_value = 4;
    prediction_steps_input.guess = false;
    prediction_steps_input.required = false;

    timeSeriesAlgorithm.inputs.set(raw_data_input.name, raw_data_input);
    timeSeriesAlgorithm.inputs.set(time_dimension_input.name, time_dimension_input);
    timeSeriesAlgorithm.inputs.set(amount_aggregate_input.name, amount_aggregate_input);
    timeSeriesAlgorithm.inputs.set(prediction_steps_input.name, prediction_steps_input);

    let json_output = new Output;
    json_output.name = 'output';
    json_output.cardinality = 1 ;
    json_output.type = OutputTypes.TABLE;

    timeSeriesAlgorithm.outputs.set(json_output.name, json_output);

    timeSeriesAlgorithm.method = RequestMethod.Post;
    timeSeriesAlgorithm.endpoint = new URL(environment.DAMUrl + '/library/TimeSeries.OBeu/R/open_spending.ts');
    timeSeriesAlgorithm.prompt = 'Select an aggregate, a time-related drilldown and the prediction steps parameter from the left and click on the execute button on top right.';


    return timeSeriesAlgorithm;

  }



  dummyDescriptiveStatistics(): Algorithm {
    let descriptiveStatisticsAlgorithm = new Algorithm();
    descriptiveStatisticsAlgorithm.title = 'Descriptive Statistics';
    descriptiveStatisticsAlgorithm.name = 'descriptive_statistics';


    let raw_data_input = new Input();
    raw_data_input.cardinality = '1';
    raw_data_input.type = InputTypes.BABBAGE_FACT_URI;
    raw_data_input.name = 'json_data';
    raw_data_input.title = 'Tabular data';
    raw_data_input.guess = false;

    let what_dimension_input = new Input();
    what_dimension_input.cardinality = 'n';
    what_dimension_input.type = InputTypes.ATTRIBUTE_REF;
    what_dimension_input.name = 'dimensions';
    what_dimension_input.title = 'Dimensions';
    what_dimension_input.required = true;
    what_dimension_input.guess = false;

  /*  let to_what_dimension_input = new Input();
    to_what_dimension_input.cardinality = '1';
    to_what_dimension_input.type = InputTypes.ATTRIBUTE_REF;
    to_what_dimension_input.name = 'to.what';
    to_what_dimension_input.title = 'To what';
    what_dimension_input.required = true;
    to_what_dimension_input.guess = false;*/


    let amount_aggregate_input = new Input();
    amount_aggregate_input.cardinality = 'n';
    amount_aggregate_input.type = InputTypes.MEASURE_REF;
    amount_aggregate_input.name = 'amounts';
    amount_aggregate_input.title = 'Amount measure';
    amount_aggregate_input.guess = false;
    amount_aggregate_input.required = true;




    descriptiveStatisticsAlgorithm.inputs.set(raw_data_input.name, raw_data_input);
    descriptiveStatisticsAlgorithm.inputs.set(what_dimension_input.name, what_dimension_input);
//    descriptiveStatisticsAlgorithm.inputs.set(to_what_dimension_input.name, to_what_dimension_input);
    descriptiveStatisticsAlgorithm.inputs.set(amount_aggregate_input.name, amount_aggregate_input);


    let json_output = new Output;
    json_output.name = 'output';
    json_output.cardinality = 1 ;
    json_output.type = OutputTypes.TABLE;

    descriptiveStatisticsAlgorithm.outputs.set(json_output.name, json_output);

    descriptiveStatisticsAlgorithm.method = RequestMethod.Post;
    descriptiveStatisticsAlgorithm.endpoint = new URL(environment.DAMUrl + '/library/DescriptiveStats.OBeu/R/open_spending.ds');


    return descriptiveStatisticsAlgorithm;

  }

}
