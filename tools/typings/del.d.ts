// Type definitions for del v1.2.0
// Project: https://github.com/sindresorhus/del
// Definitions by: Asana <https://asana.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "del" {
    import glob = require("glob");

    function Del(pattern: string): any;
    function Del(pattern: string, options: Del.Options): any;

    function Del(patterns: string[]): any;
    function Del(patterns: string[], options: Del.Options): any;

    module Del {
        function sync(pattern: string, options?: Options): string[];
        function sync(patterns: string[], options?: Options): string[];

        interface Options extends glob.IOptions {
            force?: boolean
        }
    }

    export = Del;
}
