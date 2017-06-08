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
import {ExecutionConfiguration} from '../models/analysis/executionConfiguration';
import {Configuration} from 'jasmine-spec-reporter/built/configuration';

@Injectable()
export class AlgorithmsService {
  private API_DAM_PATH: string = environment.DAMUrl + '/cubes';

  constructor(private http: Http) {
  }

  getCompatibleAlgorithms(cube: Cube): Observable<Algorithm[]> {
    let that = this;
AlgorithmsService.dummyClustering().serialize();
//console.log(JSON.stringify({outlier_detection: AlgorithmsService.dummyOutlierDetection().serialize(), rule_mining:  AlgorithmsService.dummyRuleMining().serialize()}));

return Observable.create(function (observer: any) {
      observer.next([AlgorithmsService.dummyTimeSeries(), AlgorithmsService.dummyDescriptiveStatistics(), AlgorithmsService.dummyClustering(), AlgorithmsService.dummyOutlierDetection(), AlgorithmsService.dummyRuleMining()]);
    });


  }

  getActualCompatibleAlgorithms(): Observable<Algorithm[]> {
   // console.log(JSON.stringify({time_series: AlgorithmsService.dummyTimeSeries().serialize(), descriptive_statistics: AlgorithmsService.dummyDescriptiveStatistics().serialize(), clustering:  AlgorithmsService.dummyClustering().serialize()}));

    return this.http.get(`${environment.DAMUrl}/services/meta/all`)
      .map(res => {
        let algorithms = [];
        let response = res.json();
        for (let key of Object.keys(response)){
          let algorithm =  new Algorithm().deserialize(response[key]);

          algorithms.push(algorithm);

        }

        return algorithms;

      });



  }


  getActualCompatibleAlgorithm( algorithmName): Observable<Algorithm> {

    return this.http.get(`${environment.DAMUrl}/services/meta/${algorithmName}`)
      .map(res => {

        let response = res.json();

        return new Algorithm().deserialize(response);
      });


  }


  getTimeSeriesAlgorithm(): Observable<Algorithm> {
    let that = this;
    return Observable.create(function (observer: any) {
      observer.next(AlgorithmsService.dummyTimeSeries());
    });

  }
  getDescriptiveStatisticsAlgorithm(): Observable<Algorithm> {
    let that = this;
    return Observable.create(function (observer: any) {
      observer.next(AlgorithmsService.dummyDescriptiveStatistics());
    });
  }

  getClusteringAlgorithm(): Observable<Algorithm> {
    let that = this;
    return Observable.create(function (observer: any) {
      observer.next(AlgorithmsService.dummyClustering());
    });
  }

  getOutlierDetectionAlgorithm(): Observable<Algorithm> {
    let that = this;
    return this.getActualCompatibleAlgorithm('outlier_detection');
    /*return Observable.create(function (observer: any) {
      observer.next(AlgorithmsService.dummyOutlierDetection());
    });*/
  }

  getAlgorithm(name, cube: Cube): Observable<Algorithm> {
    switch (name) {
      case 'time_series':
        return this.getTimeSeriesAlgorithm();
      case 'descriptive_statistics':
        return this.getDescriptiveStatisticsAlgorithm();
      case 'clustering':
        return this.getClusteringAlgorithm();
      case 'outlier_detection':
        return this.getOutlierDetectionAlgorithm();
      default:
        return  this.http.get(`${this.API_DAM_PATH}/algo/${name}`)
        .map(res => {

          let response = res.json();
          return new Algorithm().deserialize(response);
        });


    }

  }


  static dummyTimeSeries(): Algorithm {
    let timeSeriesAlgorithm = new Algorithm();
    timeSeriesAlgorithm.title = 'Time Series';
    timeSeriesAlgorithm.name = 'time_series';
    timeSeriesAlgorithm.description = 'Time series analysis comprises methods for analyzing time series data in order to extract meaningful statistics and other characteristics of the data. Time series forecasting is the use of a model to predict future values based on previously observed values. While regression analysis is often employed in such a way as to test theories that the current values of one or more independent time series affect the current value of another time series, this type of analysis of time series is not called "time series analysis", which focuses on comparing values of a single time series or multiple dependent time series at different points in time.';

    let raw_data_input = new Input();
    raw_data_input.cardinality = '1';
    raw_data_input.type = InputTypes.BABBAGE_AGGREGATE_URI;
    raw_data_input.name = 'json_data';
    raw_data_input.title = 'Data coming from an aggregation';
    raw_data_input.guess = false;
    raw_data_input.description = 'This is the aggregated data that will be sent to the time series algorithm. You need to select at least a year-related drilldown and an amount-related aggregate.';
    raw_data_input.required = true;

    let time_dimension_input = new Input();
    time_dimension_input.cardinality = '1';
    time_dimension_input.type = InputTypes.ATTRIBUTE_REF;
    time_dimension_input.name = 'time';
    time_dimension_input.title = 'Time dimension';
    time_dimension_input.description = 'This is the time dimension that should exist in the aggregation result.';
    time_dimension_input.guess = true;
    time_dimension_input.required = true;

    let amount_aggregate_input = new Input();
    amount_aggregate_input.cardinality = '1';
    amount_aggregate_input.type = InputTypes.AGGREGATE_REF;
    amount_aggregate_input.name = 'amount';
    amount_aggregate_input.title = 'Amount aggregate';
    amount_aggregate_input.description = 'This is the amount aggregate that should exist in the aggregation result';
    amount_aggregate_input.guess = true;
    amount_aggregate_input.required = true;

    let prediction_steps_input = new Input();
    prediction_steps_input.cardinality = '1';
    prediction_steps_input.type = InputTypes.PARAMETER;
    prediction_steps_input.name = 'prediction_steps';
    prediction_steps_input.title = 'Prediction Steps';
    prediction_steps_input.description = 'The number of time steps you want to get prediction for.';
    prediction_steps_input.data_type = 'number';
    prediction_steps_input.default_value = 4;
    prediction_steps_input.guess = false;
    prediction_steps_input.required = false;

    let configuration = new ExecutionConfiguration;

    configuration.inputs.set(raw_data_input.name, raw_data_input);
    configuration.inputs.set(time_dimension_input.name, time_dimension_input);
    configuration.inputs.set(amount_aggregate_input.name, amount_aggregate_input);
    configuration.inputs.set(prediction_steps_input.name, prediction_steps_input);

    let json_output = new Output;
    json_output.name = 'output';
    json_output.cardinality = 1 ;
    json_output.type = OutputTypes.TABLE;

    configuration.outputs.set(json_output.name, json_output);
    configuration.name = 'aggregate';
    configuration.title = 'Timeseries of aggregated data';
    configuration.algorithm = timeSeriesAlgorithm;
    configuration.method = RequestMethod.Post;
    configuration.endpoint = new URL(environment.openCpuEndpoint + '/library/TimeSeries.OBeu/R/open_spending.ts/print');
    configuration.prompt = 'Build an aggregate, with a time-related drilldown and then enter the prediction steps parameter from the left and click on the execute button on top right.';

    timeSeriesAlgorithm.configurations.set('aggregate', configuration);




    return timeSeriesAlgorithm;

  }





  static dummyOutlierDetection(): Algorithm {
    let outlierDetectionAlgorithm = new Algorithm();
    outlierDetectionAlgorithm.title = 'Outlier Detection';
    outlierDetectionAlgorithm.name = 'outlier_detection';
    outlierDetectionAlgorithm.description = 'In statistics, an outlier is an observation point that is distant from other observations. An outlier may be due to variability in the measurement or it may indicate experimental error; the latter are sometimes excluded from the data set. Outliers can occur by chance in any distribution, but they often indicate either measurement error or that the population has a heavy-tailed distribution. In the former case one wishes to discard them or use statistics that are robust to outliers, while in the latter case they indicate that the distribution has high skewness and that one should be very cautious in using tools or intuitions that assume a normal distribution. A frequent cause of outliers is a mixture of two distributions, which may be two distinct sub-populations, or may indicate \'correct trial\' versus \'measurement error\'; this is modeled by a mixture model.';

    let raw_data_input = new Input();
    raw_data_input.cardinality = '1';
    raw_data_input.type = InputTypes.BABBAGE_FACT_URI;
    raw_data_input.name = 'BABBAGE_FACT_URI';
    raw_data_input.title = 'Data coming from an aggregation';
    raw_data_input.guess = false;
    raw_data_input.description = 'This is the aggregated data that will be sent to the outlier detection algorithm. You need to select at least a measure.';
    raw_data_input.required = true;


    let configuration = new ExecutionConfiguration;

    configuration.inputs.set(raw_data_input.name, raw_data_input);

    let json_output = new Output;
    json_output.name = 'output';
    json_output.cardinality = 1 ;
    json_output.type = OutputTypes.OBJECT_COLLECTION;


    configuration.inputs.set(raw_data_input.name, raw_data_input);
    configuration.outputs.set(json_output.name, json_output);
    configuration.name = 'facts';
    configuration.title = 'Facts outlier detection';
    configuration.algorithm = outlierDetectionAlgorithm;
    configuration.method = RequestMethod.Get;
    configuration.endpoint = new URL(environment.DAMUrl + '/outlier_detection/LOF');
    configuration.prompt = 'Build an aggregate, with a time-related drilldown and then enter the prediction steps parameter from the left and click on the execute button on top right.';

    outlierDetectionAlgorithm.configurations.set( configuration.name, configuration);




    return outlierDetectionAlgorithm;

  }


  static dummyRuleMining(): Algorithm {
    let ruleMiningAlgorithm = new Algorithm();
    ruleMiningAlgorithm.title = 'Rule Mining';
    ruleMiningAlgorithm.name = 'rule_mining';
    ruleMiningAlgorithm.description = 'Association rule learning is a rule-based machine learning method for discovering interesting relations between variables in large databases. It is intended to identify strong rules discovered in databases using some measures of interestingness.[1] Based on the concept of strong rules, Rakesh Agrawal, Tomasz Imieliński and Arun Swami [2] introduced association rules for discovering regularities between products in large-scale transaction data recorded by point-of-sale (POS) systems in supermarkets. For example, the rule {\\displaystyle \\{\\mathrm {onions,potatoes} \\}\\Rightarrow \\{\\mathrm {burger} \\}} \\{{\\mathrm  {onions,potatoes}}\\}\\Rightarrow \\{{\\mathrm  {burger}}\\} found in the sales data of a supermarket would indicate that if a customer buys onions and potatoes together, they are likely to also buy hamburger meat. Such information can be used as the basis for decisions about marketing activities such as, e.g., promotional pricing or product placements. In addition to the above example from market basket analysis association rules are employed today in many application areas including Web usage mining, intrusion detection, continuous production, and bioinformatics. In contrast with sequence mining, association rule learning typically does not consider the order of items either within a transaction or across transactions.\n' +
      '\n';

    let raw_data_input = new Input();
    raw_data_input.cardinality = '1';
    raw_data_input.type = InputTypes.BABBAGE_FACT_URI;
    raw_data_input.name = 'BABBAGE_FACT_URI';
    raw_data_input.title = 'Data coming from an aggregation';
    raw_data_input.guess = false;
    raw_data_input.description = 'This is the aggregated data that will be sent to the rule mining algorithm. You need to select at least a measure.';
    raw_data_input.required = true;


    let configuration = new ExecutionConfiguration;

    configuration.inputs.set(raw_data_input.name, raw_data_input);

    let json_output = new Output;
    json_output.name = 'output';
    json_output.cardinality = 1 ;
    json_output.type = OutputTypes.OBJECT_COLLECTION;


    configuration.inputs.set(raw_data_input.name, raw_data_input);
    configuration.outputs.set(json_output.name, json_output);
    configuration.name = 'facts';
    configuration.title = 'Facts rule mining';
    configuration.algorithm = ruleMiningAlgorithm;
    configuration.method = RequestMethod.Get;
    configuration.endpoint = new URL(environment.DAMUrl + '/rule_mining');
    configuration.prompt = 'Build an aggregate, with a time-related drilldown and then enter the prediction steps parameter from the left and click on the execute button on top right.';

    ruleMiningAlgorithm.configurations.set( configuration.name, configuration);




    return ruleMiningAlgorithm;

  }




  static dummyDescriptiveStatistics(): Algorithm {
    let descriptiveStatisticsAlgorithm = new Algorithm();
    descriptiveStatisticsAlgorithm.title = 'Descriptive Statistics';
    descriptiveStatisticsAlgorithm.name = 'descriptive_statistics';
    descriptiveStatisticsAlgorithm.description = 'Descriptive statistics provide simple summaries about the sample and about the observations that have been made. Such summaries may be either quantitative, i.e. summary statistics, or visual, i.e. simple-to-understand graphs. These summaries may either form the basis of the initial description of the data as part of a more extensive statistical analysis, or they may be sufficient in and of themselves for a particular investigation.';


    let raw_data_input = new Input();
    raw_data_input.cardinality = '1';
    raw_data_input.type = InputTypes.BABBAGE_FACT_URI;
    raw_data_input.name = 'json_data';
    raw_data_input.title = 'Tabular data';
    raw_data_input.description = 'These are the raw budget facts that will be sent for analysis. By default, all dimensions are included.';
    raw_data_input.guess = false;

    let what_dimension_input = new Input();
    what_dimension_input.cardinality = 'n';
    what_dimension_input.type = InputTypes.ATTRIBUTE_REF;
    what_dimension_input.name = 'dimensions';
    what_dimension_input.title = 'Analyzed dimensions';
    what_dimension_input.required = true;
    what_dimension_input.description = 'Select a specific dimension for further frequency analysis. If a dimension contains empty values, it should not be selected for further analysis.';
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
    amount_aggregate_input.description = 'This is the measure that will be used for the descriptive statistics analysis.';
    amount_aggregate_input.title = 'Amount measure';
    amount_aggregate_input.guess = false;
    amount_aggregate_input.required = true;




    let factsConfig = new ExecutionConfiguration();
    factsConfig.inputs.set(raw_data_input.name, raw_data_input);
    factsConfig.inputs.set(what_dimension_input.name, what_dimension_input);
//    descriptiveStatisticsAlgorithm.inputs.set(to_what_dimension_input.name, to_what_dimension_input);
    factsConfig.inputs.set(amount_aggregate_input.name, amount_aggregate_input);
    factsConfig.prompt = 'Build an budget facts subset, by selecting at least the dimension that is to be analyzed.';

    let json_output = new Output;
    json_output.name = 'output';
    json_output.cardinality = 1 ;
    json_output.type = OutputTypes.TABLE;

    factsConfig.outputs.set(json_output.name, json_output);
    factsConfig.name = 'facts';
    factsConfig.title = 'Descriptive statistics from facts';
    factsConfig.method = RequestMethod.Post;
    factsConfig.endpoint = new URL(environment.openCpuEndpoint + '/library/DescriptiveStats.OBeu/R/open_spending.ds');
    factsConfig.algorithm = descriptiveStatisticsAlgorithm;

    descriptiveStatisticsAlgorithm.configurations.set('facts', factsConfig);

    return descriptiveStatisticsAlgorithm;



  }

  static dummyClustering(): Algorithm {
    let clusteringAlgorithm = new Algorithm();
    clusteringAlgorithm.title = 'Clustering';
    clusteringAlgorithm.name = 'clustering';
    clusteringAlgorithm.description = 'Cluster analysis or clustering is the task of grouping a set of objects in such a way that objects in the same group (called a cluster) are more similar (in some sense or another) to each other than to those in other groups (clusters). It is a main task of exploratory data mining, and a common technique for statistical data analysis, used in many fields, including machine learning, pattern recognition, image analysis, information retrieval, bioinformatics, data compression, and computer graphics.';


    let raw_data_input = new Input();
    raw_data_input.cardinality = '1';
    raw_data_input.type = InputTypes.BABBAGE_FACT_URI;
    raw_data_input.name = 'json_data';
    raw_data_input.title = 'Tabular data';
    raw_data_input.description = 'These are the raw budget facts that will be sent for analysis. By default, all dimensions are included.';
    raw_data_input.guess = false;

    let agg_raw_data_input = new Input();
    agg_raw_data_input.cardinality = '1';
    agg_raw_data_input.type = InputTypes.BABBAGE_AGGREGATE_URI;
    agg_raw_data_input.name = 'json_data';
    agg_raw_data_input.title = 'Aggregate';
    agg_raw_data_input.description = 'This is budget aggregate that will be sent for analysis. By default, all dimensions are included.';
    agg_raw_data_input.guess = false;

    let what_dimension_input = new Input();
    what_dimension_input.cardinality = 'n';
    what_dimension_input.type = InputTypes.ATTRIBUTE_REF;
    what_dimension_input.name = 'dimensions';
    what_dimension_input.title = 'Analyzed dimensions';
    what_dimension_input.required = true;
    what_dimension_input.description = 'Select a specific dimension for further frequency analysis. If a dimension contains empty values, it should not be selected for further analysis.';
    what_dimension_input.guess = false;


    let measured_dimension_input = new Input();
    measured_dimension_input.cardinality = 'n';
    measured_dimension_input.type = InputTypes.ATTRIBUTE_REF;
    measured_dimension_input.name = 'measured.dim';
    measured_dimension_input.title = 'Aggregate modifier dimension';
    measured_dimension_input.required = true;
    measured_dimension_input.description = 'This dimension is used to create additional, virtual measure aggregates, based on the actual values of the dimension.';
    measured_dimension_input.guess = false;

  /*  let to_what_dimension_input = new Input();
    to_what_dimension_input.cardinality = '1';
    to_what_dimension_input.type = InputTypes.ATTRIBUTE_REF;
    to_what_dimension_input.name = 'to.what';
    to_what_dimension_input.title = 'To what';
    what_dimension_input.required = true;
    to_what_dimension_input.guess = false;*/


    let amount_measure_input = new Input();
    amount_measure_input.cardinality = 'n';
    amount_measure_input.type = InputTypes.MEASURE_REF;
    amount_measure_input.name = 'amounts';
    amount_measure_input.description = 'This is the measure that will be used for the descriptive statistics analysis.';
    amount_measure_input.title = 'Amount measure';
    amount_measure_input.guess = false;
    amount_measure_input.required = true;


    let amount_aggregate_input = new Input();
    amount_aggregate_input.cardinality = 'n';
    amount_aggregate_input.type = InputTypes.AGGREGATE_REF;
    amount_aggregate_input.name = 'amounts';
    amount_aggregate_input.description = 'This is the aggregate that will be used for the descriptive statistics analysis.';
    amount_aggregate_input.title = 'Amount aggregate';
    amount_aggregate_input.guess = false;
    amount_aggregate_input.required = true;

    let clustering_method_input = new Input();
    clustering_method_input.cardinality = '1';
    clustering_method_input.type = InputTypes.PARAMETER;
    clustering_method_input.name = 'cl.method';
    clustering_method_input.title = 'Clustering Method';
    clustering_method_input.description = 'The method used to cluster observations.';
    clustering_method_input.data_type = 'string';
    clustering_method_input.default_value = 'pam';
    clustering_method_input.guess = false;
    clustering_method_input.required = false;


    let factsConfiguration = new ExecutionConfiguration();
    let aggregatesConfiguration = new ExecutionConfiguration();



    factsConfiguration.inputs.set(raw_data_input.name, raw_data_input);
    factsConfiguration.inputs.set(what_dimension_input.name, what_dimension_input);
    factsConfiguration.inputs.set(clustering_method_input.name, clustering_method_input);
//    descriptiveStatisticsAlgorithm.inputs.set(to_what_dimension_input.name, to_what_dimension_input);
    factsConfiguration.inputs.set(amount_measure_input.name, amount_measure_input);
    factsConfiguration.prompt = 'Build an budget facts subset, by selecting at least the dimension that is to be analyzed.';


    aggregatesConfiguration.inputs.set(agg_raw_data_input.name, agg_raw_data_input);
    aggregatesConfiguration.inputs.set(what_dimension_input.name, what_dimension_input);
    aggregatesConfiguration.inputs.set(measured_dimension_input.name, measured_dimension_input);
    aggregatesConfiguration.inputs.set(clustering_method_input.name, clustering_method_input);

//    descriptiveStatisticsAlgorithm.inputs.set(to_what_dimension_input.name, to_what_dimension_input);
    aggregatesConfiguration.inputs.set(amount_aggregate_input.name, amount_aggregate_input);
    aggregatesConfiguration.prompt = 'Build an budget aggregate, by selecting at least the dimension that is to be analyzed.';

    let json_output = new Output;
    json_output.name = 'output';
    json_output.cardinality = 1 ;
    json_output.type = OutputTypes.TABLE;

    factsConfiguration.outputs.set(json_output.name, json_output);

    factsConfiguration.method = RequestMethod.Post;
    factsConfiguration.endpoint = new URL(environment.openCpuEndpoint + '/library/Cluster.OBeu/R/open_spending.cl');
    factsConfiguration.algorithm = clusteringAlgorithm;
    factsConfiguration.name = 'facts';
    factsConfiguration.title = 'Clustering facts';


    clusteringAlgorithm.configurations.set('facts', factsConfiguration);

    aggregatesConfiguration.outputs.set(json_output.name, json_output);

    aggregatesConfiguration.method = RequestMethod.Post;
    aggregatesConfiguration.endpoint = new URL(environment.openCpuEndpoint + '/library/Cluster.OBeu/R/open_spending.cl');
    aggregatesConfiguration.algorithm = clusteringAlgorithm;
    aggregatesConfiguration.name = 'aggregates';
    aggregatesConfiguration.title = 'Clustering aggregates';



    clusteringAlgorithm.configurations.set('facts', factsConfiguration);
    clusteringAlgorithm.configurations.set('aggregates', aggregatesConfiguration);
;
    return clusteringAlgorithm;



  }

}
