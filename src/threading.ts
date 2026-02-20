export function makeParallel<T, TT>(func: (arg: T) => Promise<TT> | TT, args: T[]): Promise<TT[]>{
    return Promise.all(args.map(func));
}

export async function makeChunkParallel<T, TT>(func: (arg: T) => Promise<TT> | TT, args: T[], chunkSize: number): Promise<TT[]>{
    if(chunkSize <= 0)
        throw new Error(`Chunk size must be greater than zero`);

    const response: TT[] = [];
    const totalChunks = Math.ceil(args.length/chunkSize);
    for(let i = 0; i < totalChunks; i++){
        const argChunk = args.slice(i*chunkSize, (i+1)*chunkSize);
        const chunkResponse = await makeParallel(func, argChunk);
        response.push(...chunkResponse);
    }

    return response;
}