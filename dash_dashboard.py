from dash import Dash
from dash_enterprise_libraries import ddk
from dash_enterprise_libraries import dash_embedded
from dash_embedded import Embeddable

app = Dash(__name__, plugins=[Embeddable(origins=['https://<your-host-application-hostname>'])])

...

app.layout = ddk.App(
    [
        ...
        ddk.Card(
            [
                ddk.CardHeader(title="Triggering callbacks from Dash app & host app"),
                dash_embedded.ConsumerContext(id="clicks", path=["myObject", "clicks"]),
                dash_embedded.ConsumerContext(id="data-one", path=["myObject", "data", "dataOne"]),
                dash_embedded.ConsumerContext(id="data-two", path=["myObject", "data", "dataTwo"]),
                ...
            ],
            width=50,
        ),
        ddk.ControlCard(
            [
                ddk.CardHeader(title="Triggering host app functions from Dash app"),
                dash_embedded.ConsumerFunction(
                    id="host-app-multiply", path=["myObject", "multiplyFunc"]
                ),
                dash_embedded.ConsumerFunction(id="host-app-sum", path=["myObject", "sumFunc"]),
                ddk.ControlItem(...),
                ...
            ],
            width=50,
        ),
        ...
    ]
)
...

# Access the nested objects via `path=["myObject"]`
@callback(Output("display-full-object", "children"), Input("full-object", "value"))
def display(value):
    return json.dumps(value, indent=2)


# Access nested values via `path=[...]`
@callback(
    Output("display-data_dataOne_y[1]", "children"), Input("data_dataOne_y[1]", "value"))
def display(value):
    return "data.dataOne.y[1]={}".format(value)


# Trigger callback from the host app data & Dash app buttons
@callback(
    Output("plot", "figure"),
    Input("update", "n_clicks"), Input("clicks", "value"),
    State("data-one", "value"), State("data-two", "value"),
)
def update_figure(clicks_dash, clicks_host, trace1, trace2):
    ...
    return go.Figure(...)


# Trigger host app functions by sending data into the `params` property
@callback(
    Output("host-app-sum", "params"),
    Input("sum", "n_clicks"),
    State("input-x", "value"), State("input-y", "value"),
)
def trigger_sum(_, x, y):
    return [x, y]
...