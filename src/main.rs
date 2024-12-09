use axum::routing::{get, get_service};
use axum::Router;
use tower_http::services::ServeDir;
use cqrs_demo::route_handler::{command_handler, query_handler};
use cqrs_demo::state::new_application_state;

#[tokio::main]
async fn main() {
    let state = new_application_state().await;
    // Configure the Axum routes and services.
    // For this example a single logical endpoint is used and the HTTP method
    // distinguishes whether the call is a command or a query.
    let frontend = get_service(ServeDir::new("frontend")).handle_error(|err| async move {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            format!("Unhandled internal error: {}", err),
        )
    });

    let router = Router::new()
        .route(
            "/account/:account_id",
            get(query_handler).post(command_handler),
        )
        .nest_service("/", frontend)
        .with_state(state);

    // Start the Axum server.
    axum::Server::bind(&"127.0.0.1:3030".parse().unwrap())
        .serve(router.into_make_service())
        .await
        .unwrap();
}
