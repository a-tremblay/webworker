export class StringHelper {

  static ab2b64(arrayBuffer: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  }
  static b642ab(base64string: string){
    return Uint8Array.from(atob(base64string), c => c.charCodeAt(0));
  }
}
