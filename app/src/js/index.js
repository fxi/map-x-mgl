/*jshint esversion: 6 */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'hint.css';
import '../css/mx.css';
import '../css/mx_story.css';
import '../css/mx_dashboard.css';
import '../css/mx_colors.css';

import * as mx from './mx_init.js';
window.mx = mx;

