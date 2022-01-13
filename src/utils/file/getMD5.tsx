import SparkMD5 from 'spark-md5';

export default (file: File) =>
  new Promise((res, rej) => {
    const chunkSize = 2097152, // Read in chunks of 2MB
      chunks = Math.ceil(file.size / chunkSize),
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();

    let currentChunk = 0;

    fileReader.onload = (e) => {
      spark.append(e?.target?.result as ArrayBuffer); // Append array buffer
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        res(spark.end());
      }
    };

    fileReader.onerror = rej;

    function loadNext() {
      const start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize;

      fileReader.readAsArrayBuffer(file.slice(start, end));
    }

    loadNext();
  });
