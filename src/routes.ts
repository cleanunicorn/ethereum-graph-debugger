/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { iocContainer } from './inversify/ioc';
import { DebuggerController } from './api/service/controller/DebuggerController';
import { FileController } from './api/service/controller/FileController';
import { DisassembleController } from './api/service/controller/DisassembleController';
import { TransactionController } from './api/service/controller/TransactionController';
import { ControlFlowGraphController } from './api/service/controller/ControlFlowGraphController';

const models: TsoaRoute.Models = {
    "Opcode": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "opcode": { "dataType": "double", "required": true },
            "parameters": { "dataType": "double", "required": true },
        },
    },
    "OperationResponse": {
        "properties": {
            "offset": { "dataType": "double", "required": true },
            "opcode": { "ref": "Opcode", "required": true },
            "argument": { "dataType": "string", "required": true },
            "begin": { "dataType": "double" },
            "end": { "dataType": "double" },
        },
    },
    "TraceResponse": {
        "properties": {
            "cfg": { "dataType": "string", "required": true },
            "operations": { "dataType": "array", "array": { "ref": "OperationResponse" }, "required": true },
            "trace": { "dataType": "any", "required": true },
        },
    },
    "ContractFile": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
            "path": { "dataType": "string", "required": true },
        },
    },
    "DisassembledContractResponse": {
        "properties": {
            "hasConstructor": { "dataType": "boolean", "required": true },
            "constructorOperations": { "dataType": "array", "array": { "ref": "OperationResponse" }, "required": true },
            "runtimeOperations": { "dataType": "array", "array": { "ref": "OperationResponse" }, "required": true },
            "bytecode": { "dataType": "string", "required": true },
        },
    },
    "TransactionReceipt": {
        "properties": {
            "transactionHash": { "dataType": "string", "required": true },
            "data": { "dataType": "string", "required": true },
            "to": { "dataType": "string", "required": true },
            "from": { "dataType": "string", "required": true },
        },
    },
    "GFCResponse": {
        "properties": {
            "cfg": { "dataType": "string", "required": true },
            "operations": { "dataType": "array", "array": { "ref": "OperationResponse" }, "required": true },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.get('/debug/:tx',
        function(request: any, response: any, next: any) {
            const args = {
                tx: { "in": "path", "name": "tx", "required": true, "dataType": "string" },
                source: { "in": "query", "name": "source", "required": true, "dataType": "string" },
                name: { "in": "query", "name": "name", "required": true, "dataType": "string" },
                path: { "in": "query", "name": "path", "required": true, "dataType": "string" },
                blockchainHost: { "in": "query", "name": "blockchainHost", "dataType": "string" },
                blockchainProtocol: { "in": "query", "name": "blockchainProtocol", "dataType": "string" },
                blockchainBasicAuthUsername: { "in": "query", "name": "blockchainBasicAuthUsername", "dataType": "string" },
                blockchainBasicAuthPassword: { "in": "query", "name": "blockchainBasicAuthPassword", "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<DebuggerController>(DebuggerController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.debug.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/files/:dir',
        function(request: any, response: any, next: any) {
            const args = {
                dir: { "in": "path", "name": "dir", "required": true, "dataType": "string" },
                extension: { "in": "query", "name": "extension", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<FileController>(FileController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.findContractsInDir.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/disassemble',
        function(request: any, response: any, next: any) {
            const args = {
                source: { "in": "query", "name": "source", "required": true, "dataType": "string" },
                name: { "in": "query", "name": "name", "required": true, "dataType": "string" },
                path: { "in": "query", "name": "path", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<DisassembleController>(DisassembleController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.disassembleSourceCode.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/tx/:tx/receipt',
        function(request: any, response: any, next: any) {
            const args = {
                tx: { "in": "path", "name": "tx", "required": true, "dataType": "string" },
                blockchainHost: { "in": "query", "name": "blockchainHost", "dataType": "string" },
                blockchainProtocol: { "in": "query", "name": "blockchainProtocol", "dataType": "string" },
                blockchainBasicAuthUsername: { "in": "query", "name": "blockchainBasicAuthUsername", "dataType": "string" },
                blockchainBasicAuthPassword: { "in": "query", "name": "blockchainBasicAuthPassword", "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<TransactionController>(TransactionController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getReceipt.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/cfg/source',
        function(request: any, response: any, next: any) {
            const args = {
                source: { "in": "query", "name": "source", "required": true, "dataType": "string" },
                name: { "in": "query", "name": "name", "required": true, "dataType": "string" },
                path: { "in": "query", "name": "path", "required": true, "dataType": "string" },
                constructor: { "in": "query", "name": "constructor", "dataType": "boolean" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<ControlFlowGraphController>(ControlFlowGraphController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getCFGFromSource.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/cfg/bytecode',
        function(request: any, response: any, next: any) {
            const args = {
                bytecode: { "in": "query", "name": "bytecode", "required": true, "dataType": "string" },
                constructor: { "in": "query", "name": "constructor", "dataType": "boolean" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<ControlFlowGraphController>(ControlFlowGraphController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getCFGFromBytecode.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });


    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name, fieldErrors);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, fieldErrors);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, fieldErrors);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, fieldErrors, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
