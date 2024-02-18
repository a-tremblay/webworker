# Webworker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.
Node: 20

## Development server

Run `ng serve` for a dev server. Navigate to `https://localhost:4200/`. The application will automatically reload if you change any of the source files.

For the crypto function, the web server needs to run on Https context, a development sefsigned certificate is provided. 

## Implementing Webworker

The UI Component triggering the data processing can be found here
```src/app/component/benchmark/benchmark.component.ts```

There are 4 processing functions from the ```src/app/service/data-processing.service.ts```

- Encrypt
- Decrypt
- Hydrate 
- Hash and combine

## Data Generation

The service responsible for generating the data is located in ```src/app/service/data-generator.service.ts```

During development, I recommend changing the ```BATCH_SIZE``` constant to a small number ( e.g. 10 ) so the processing doesn't 
block the app after a changes. 

#### todo

The benchmark component uses a Pull method to fetch the data from the service. 
It will be nice to implement an observable using a push at a scheduled interval.

## Testing methodology 

Web worker will have an overhead, and the ```BATCH_SIZE``` would have an impact on the implementation speed

During testing assume a large batch number like ```BATCH_SIZE=1000```

