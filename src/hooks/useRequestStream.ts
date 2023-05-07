import axios from "axios";
import { useState } from "react";
import { Deferred } from "@/utils/defer";

const useStreamRequest = <T>() => {
    const [message, setMessage] = useState<string>("");
    const [data, setData] = useState<T>();
    const [linkLoading, setLinkLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const sendRequest = <TParams>(method: string, url: string, data: TParams) => {
        setLinkLoading(true);
        setFetching(true);
        setSuccess(false);
        setError(null);

        const source = axios.CancelToken.source();
        const defer = new Deferred();

        axios<string>({
            method: method,
            url: url,
            responseType: "stream",
            data: data,
            cancelToken: source.token,
            timeout: 1000 * 60 * 5,
            onDownloadProgress: (progressEvent) => {
                setLinkLoading(false);
                const dataChunk = progressEvent.event.currentTarget.response as string;
                let content = "";
                dataChunk
                    .split("\n")
                    .filter((s) => s.length > 0)
                    .forEach((lineString: string) => {
                        if (!lineString.includes("message")) {
                            return;
                        }
                        const line = JSON.parse(lineString) as { message: string };
                        if (line.message !== undefined) {
                            content += line.message;
                        }
                    });
                setMessage(content);
            },
        })
            .then((response) => {
                const data = response.data
                    .split("\n")
                    .filter((s: string) => s.length > 0)
                    .map((s: string) => JSON.parse(s));
                defer.resolve(data);
                setData(data as T);
                setLinkLoading(false);
                setSuccess(true);
                setFetching(false);
                setMessage('');
            })
            .catch((error) => {
                console.error("Request error:", error);
                if (!axios.isCancel(error)) {
                    defer.reject(error);
                    // setError(`Error: ${error.message}`);
                    setError("请求出错");
                    setLinkLoading(false);
                    setSuccess(false);
                    setFetching(false);
                    setMessage('');
                }
            });

        return {
            cancel: () => {
                source.cancel("Request cancelled by user");
            },
            wait: () => {
                return defer.promise;
            }
        };
    };

    return {
        data,
        message,
        linkLoading,
        fetching,
        error,
        success,
        sendRequest,
    };
};

export default useStreamRequest;
