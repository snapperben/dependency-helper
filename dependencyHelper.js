/**
 This helper allows a service to create a single promise dependant on one or more others.
 The main promise will not be resolved until all dependent promises have resolved
 */
"use strict";
define(["dojo/Deferred"],function (_promise) {
   let PromiseDependencyHelper = function () {
	   this.Deferred = _promise;

	   this.promiseStatusList = {};
	   this.isReady = false;
	   this.masterPromise = new this.Deferred();

	   /**
		* Checks that all dependencies are successful
		* N.B. If not ready, this returns FALSE
		*
		* @return {boolean}
		*/
	   this.checkPromisesComplete = function () {
		   if (this.masterPromise) {
			   let success = true, complete = true, msg = '';
			   for (let dep in this.promiseStatusList) {
				   if (this.promiseStatusList[dep].complete) {
					   if (!this.promiseStatusList[dep].success) {
						   success = false;
						   msg += (msg ? '\n' : '') + this.promiseStatusList[dep].msg
					   }
				   } else {
					   complete = false;
					   break
				   }
			   }
			   if (complete) {
				   if (success) this.masterPromise.resolve();
				   else this.masterPromise.reject(msg)
			   }
		   }
	   };
	   /**
		* Called when all promises have been added to the helper
		* @return {*}
		*/
	   this.processPromises = function () {
		   this.checkPromisesComplete();
		   return this.masterPromise
	   };
	   /**
		* This is to set up a dependency.
		* The dependency is assumed to know when it is ready.
		*
		* @param _promiseName - The object whose dependency is being set
		* @param _promise - the deferred promise for the  update.
		*/
	   this.setPromise = function (_promiseName, _promise) {
		   if (_promise) {
			   if (this.promiseStatusList[_promiseName])
				   throw new Error("Promise '" + _promiseName + "' already defined!");

			   this.promiseStatusList[_promiseName] = {
				   objectName: _promiseName,
				   success: false,
				   complete: false
			   };
			   if (_promise.isRejected()) {
				   this.promiseStatusList[_promiseName].success = false;
				   this.promiseStatusList[_promiseName].complete = true
			   } else if (_promise.isResolved()) {
				   this.promiseStatusList[_promiseName].success = true;
				   this.promiseStatusList[_promiseName].complete = true
			   } else {
				   _promise.then(function () {
									  this.setPromiseCompleted(_promiseName);
								  }.bind(this),
								  function (_errMsg) {
									  this.setPromiseFailed(_promiseName, _errMsg)
								  }.bind(this))
			   }
		   }
	   };

	   this.setPromiseCompleted = function (_promiseName) {
		   this.promiseStatusList[_promiseName].success = true;
		   this.promiseStatusList[_promiseName].complete = true;
		   this.checkPromisesComplete()
	   }.bind(this);
	   this.setPromiseFailed = function (_promiseName, _errMsg) {
		   this.promiseStatusList[_promiseName].success = false;
		   this.promiseStatusList[_promiseName].msg = _errMsg;
		   this.promiseStatusList[_promiseName].complete = true;
		   this.checkPromisesComplete()
	   }.bind(this)
   };
	
   return PromiseDependencyHelper;
});