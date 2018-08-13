'use strict';

export interface KSQLCommandResponse {
    statementText : string,
    commandId: string,
    commandStatus : KSQLCommandStatus
}

export interface KSQLCommandStatus{
    status :string,
    message: string
}