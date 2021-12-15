# Creating a function to print accuracy, precision, recall and f1 scores
from sklearn.model_selection import cross_val_score
import numpy as np
from tqdm.notebook import tqdm


def evaluate_model(model, X, y, print_results=True, cv=5):
    """The function evalutes the model on six metrics using cross validation scores for each.
    The six metrics are:
    1. Accuracy
    2. Precision
    3. Recall
    4. f1 score
    5. Modified Brier score = (neg_brier_score + 1)
    6. Area under the ROC curve
    
    
    Notes:
        The higher the value of the metric, the better. 
        Therefore, the Brier score is taken as a negative value. Furthermore, to make Brier score easier to 
        compare to other metrics, a constant value of `1` is added to the `neg_brier_score`. 
    
    Args:
        model (object): An instantiated object of a sklearn classifier.
        X (ndarray or pandas dataframe): Contains the features from the dataset.
        y (ndarray or pandas dataframe): Contains the target or response varible from the dataset.
        print_results (bool): Prints the metric scores if true.
    
    Returns:
        performance_dict (dict): A dictionary containing the four performance metrics.
    """
    # Setting up random seed to ensure all models are evaluated on same data splits
    np.random.seed(100)
    
    # Creating a list of metrics
    metrics_list = ['accuracy', 'precision', 'recall', 'f1', 'neg_brier_score', 'roc_auc']
    performance_dict = {}
      
    for metric in metrics_list:
        metric_score = cross_val_score(model,
                                       X,
                                       y,
                                       cv=cv,
                                       scoring=metric,
                                       verbose=3,
                                       n_jobs=-1)
        
        performance_dict.update({metric: metric_score.mean()})
    
    # Modify neg_brier_score to better compare the value with other metrics.
    performance_dict.update({"modified_brier_score": performance_dict.get("neg_brier_score") + 1})
    performance_dict.pop("neg_brier_score")
    
    # Displaying Results
    if print_results:
        print("######### Averaged Cross Validation Scores ##########\n"
              "Accuracy score:       {accuracy: .2%}\n"
              "Precision score:      {precision: 0.2%}\n"
              "Recall score:         {recall: 0.2%}\n"
              "F1 score:             {f1: 0.2%}\n"
              "Modified Brier score: {modified_brier_score: 0.3f}\n"
              "ROC Area Under Curve: {roc_auc: .3f}".format(**performance_dict))
    
    # Print statement to know completion, incase of function being called multiple times in a cell.
    print("Model evaluation complete.") 
    
    return performance_dict