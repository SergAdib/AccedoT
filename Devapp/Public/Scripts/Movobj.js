/*
 * @Exports simple object of Movie instance
 *
 * Creates a simple Movie Object with given (data)
 * or by default if no / not full data provided
 */

export function createMovObj (data) {
  if (!data) data = [];
  this.title = data.title || "Movie title";
  this.description = data.description || "Movie description goes here";
  this.type = data.type || "Movie type";
  this.PD = (data.publishedDate ? (new Date(data.publishedDate)).toDateString() : (new Date()).toDateString());
  this.AD = (data.availableDate ? (new Date(data.availableDate)).toDateString() : (new Date()).toDateString());
  this.meta = [];
    if (!data.metadata || data.metadata.length === 0) {
      let obj = {};
      obj.value = "en";
      obj.name = "language";
      this.meta.push(obj);
    } else for (var obj of data.metadata) this.meta.push(obj);
  this.contents = [];
    if (!data.contents || data.contents.length === 0) {
      let obj = {};
      obj.uri = "#";
      obj.format = "Video";
      obj.width = 0;
      obj.height = 0;
      obj.lang = "en";
      obj.duration = 0;
      obj.geoLock = false;
      obj.id = "Video id";
      this.contents.push(obj);
    } else for (var obj of data.contents) this.contents.push(obj);
  this.credits = [];
    if (data.credits) {
      for (var obj of data.credits) {
        if (obj.role === obj.name) obj.role = "Starring";
        this.credits.push(obj);
      }
    }
  this.parentalRatings = [];
    if (data.parentalRatings) {
      for (var obj of data.parentalRatings) this.parentalRatings.push(obj);
    }
  this.images = [];
    if (!data.images || data.images.length === 0) {
      let obj = {};
      obj.type = "cover";
      obj.uri = "#";
      obj.width = 0;
      obj.height = 0;
      obj.id = "Image id";
      this.images.push(obj);
    } else for (var obj of data.images) this.images.push(obj);
  this.categories = [];
    if (!data.categories || data.categories.length === 0) {
      let obj = {};
      obj.title = "Movie";
      obj.description = "Just movie";
      obj.id = "Category id";
      this.categories.push(obj);
    } else for (var obj of data.categories) this.categories.push(obj);
  this.id = data.id || "Movie id";
  return this;
}
