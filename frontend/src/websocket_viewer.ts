import React from "react";
import PropTypes from "prop-types";
import websocketClient from "./websockets/client";

class Index extends React.Component {
    state = {
        message: "",
        received: [],
        connected: false,
    };
    websocketClient: any;

    componentDidMount() {
        websocketClient(
            {
                queryParams: {
                    favoritePizza: "supreme",
                },
                onMessage: (message: any) => {
                    console.log(message);
                    this.setState(({ received }) => {
                        return {
                            received: [...received, message],
                        };
                    });
                },
                onDisconnect: () => {
                    this.setState({ connected: false });
                },
            },
            (websocketClient: any) => {
                this.setState({ connected: true }, () => {
                    this.websocketClient = websocketClient;
                });
            }
        );
    }

    handleSendMessage = () => {
        const { message } = this.state;
        this.websocketClient.send({ message });
        this.setState({ message: "" });
    };

    render() {
        const { message, connected, received } = this.state;

        return (
            <>
            <div className= "row" >
            <div className="col-sm-6" >
                <label className="form-label" > Send a Message < /label>
                    < input
        className = "form-control mb-3"
        type = "text"
        name = "message"
        placeholder = "Type your message here..."
        value = { message }
        onChange = {(event) =>
        this.setState({ message: event.target.value })
    }
            />
    < button
className = "btn btn-primary"
onClick = { this.handleSendMessage }
    >
    Send Message
        < /button>
        < /div>
        < div className = "row" >
            <div className="col-sm-12" >
                <div className="messages" >
                    <header>
                    <p>
                    <i
                      className={ `fas ${connected ? "fa-circle" : "fa-times"}` }
/>{" "}
{ connected ? "Connected" : "Not Connected" }
</p>
    < /header>
    < ul >
{
    received.map(({ message }, index) => {
        return <li key={ `${message}_${index}` }> { message } < /li>;
    })
}
{
    connected && received.length === 0 && (
        <li>No messages received yet.< /li>
                  )
}
</ul>
    < /div>
    < /div>
    < /div>
    < /div>
    < />
    );
  }
}

Index.propTypes = {
    // prop: PropTypes.string.isRequired,
};

export default Index;