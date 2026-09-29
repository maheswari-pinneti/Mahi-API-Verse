import * as ts from 'typescript';

export interface SdkEndpoint {
  method: string;
  path: string;
  name?: string;
}

export interface SdkDefinition {
  name: string;
  baseUrl: string;
  endpoints: SdkEndpoint[];
}

export class SdkGenerator {
  public static generateTypeScriptSdk(def: SdkDefinition): string {
    const factory = ts.factory;

    // Helper to capitalize route names
    const toCamelCase = (str: string) => {
      return str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    };

    const classMethods: ts.MethodDeclaration[] = def.endpoints.map(ep => {
      const methodName = toCamelCase(ep.name || `${ep.method.toLowerCase()}_${ep.path.replace(/\//g, '_')}`);
      
      // return fetch(this.baseUrl + path, { method })
      const fetchCall = factory.createCallExpression(
        factory.createIdentifier('fetch'),
        undefined,
        [
          factory.createBinaryExpression(
            factory.createPropertyAccessExpression(
              factory.createThis(),
              factory.createIdentifier('baseUrl')
            ),
            factory.createToken(ts.SyntaxKind.PlusToken),
            factory.createStringLiteral(ep.path)
          ),
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(
                factory.createIdentifier('method'),
                factory.createStringLiteral(ep.method)
              )
            ],
            false
          )
        ]
      );

      return factory.createMethodDeclaration(
        [factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
        undefined,
        factory.createIdentifier(methodName),
        undefined,
        undefined,
        [],
        undefined,
        factory.createBlock(
          [
            factory.createVariableStatement(
              undefined,
              factory.createVariableDeclarationList(
                [
                  factory.createVariableDeclaration(
                    factory.createIdentifier('response'),
                    undefined,
                    undefined,
                    factory.createAwaitExpression(fetchCall)
                  )
                ],
                ts.NodeFlags.Const
              )
            ),
            factory.createReturnStatement(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('response'),
                  factory.createIdentifier('json')
                ),
                undefined,
                []
              )
            )
          ],
          true
        )
      );
    });

    // Create the Client Class
    const classDecl = factory.createClassDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier(`${def.name.replace(/[^a-zA-Z0-9]/g, '')}Client`),
      undefined,
      undefined,
      [
        // private baseUrl: string;
        factory.createPropertyDeclaration(
          [factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
          factory.createIdentifier('baseUrl'),
          undefined,
          factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          undefined
        ),
        // constructor(baseUrl: string) { this.baseUrl = baseUrl; }
        factory.createConstructorDeclaration(
          undefined,
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              factory.createIdentifier('baseUrl'),
              undefined,
              factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
              undefined
            )
          ],
          factory.createBlock(
            [
              factory.createExpressionStatement(
                factory.createBinaryExpression(
                  factory.createPropertyAccessExpression(
                    factory.createThis(),
                    factory.createIdentifier('baseUrl')
                  ),
                  factory.createToken(ts.SyntaxKind.EqualsToken),
                  factory.createIdentifier('baseUrl')
                )
              )
            ],
            true
          )
        ),
        ...classMethods
      ]
    );

    const sourceFile = factory.createSourceFile(
      [classDecl],
      factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None
    );

    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    return printer.printFile(sourceFile);
  }
}
