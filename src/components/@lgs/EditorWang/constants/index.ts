export enum EventType {
  CLEAR_CONTENT = 'CLEAR_CONTENT',
  PREVIEW = 'PREVIEW',
  REPLACE_IMAGE = 'REPLACE_IMAGE',
  UPLOAD_AUDIO = 'UPLOAD_AUDIO',
}

export enum Svgs {
  UPLOAD_AUDIO = '<svg t="1637634971457" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7981" width="16" height="16"><path d="M983.792981 0H40.211115A40.5504 40.5504 0 0 0 0.002048 40.96v942.08c0 22.664533 17.954133 40.96 40.209067 40.96h943.581866a40.5504 40.5504 0 0 0 40.209067-40.96V40.96c0-22.664533-17.954133-40.96-40.209067-40.96z m-235.383466 207.530667v118.784H581.702315v326.8608c0 81.92-62.190933 148.548267-138.8544 148.548266-76.663467 0-138.8544-63.351467-138.8544-141.448533 0-78.097067 62.122667-141.448533 138.8544-141.448533 31.607467 0 60.074667-2.730667 83.3536 16.110933v-327.68l222.208 0.273067z" fill="#999999" p-id="7982"></path></svg>',
  CLEAR_CONTENT = '<svg t="1697531373913" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10037" width="200" height="200"><path d="M824.4 438.8c0-37.6-30-67.6-67.6-67.6l-135.2 0L621.6 104.8c0-37.6-30-67.6-67.6-67.6-37.6 0-67.6 30-67.6 67.6l0 266.4L358.8 371.2c-37.6 0-67.6 30-67.6 67.6l0 67.6L828 506.4l0-67.6L824.4 438.8 824.4 438.8zM824.4 574c-11.2 0-536.8 0-536.8 0S250 972 88.4 972L280 972c75.2 0 108.8-217.6 108.8-217.6s33.6 195.2 3.6 217.6l105.2 0c-3.6 0 0 0 11.2 0 52.4-7.6 60-247.6 60-247.6s52.4 244 45.2 244c-26.4 0-78.8 0-105.2 0l0 0 154 0c-7.6 0 0 0 11.2 0 48.8-11.2 52.4-187.6 52.4-187.6s22.4 187.6 15.2 187.6c-18.8 0-48.8 0-67.6 0l-3.6 0 90 0C895.6 972 903.2 784.4 824.4 574L824.4 574z" fill="#272536" p-id="10038"></path></svg>',
  PREVIEW = '<svg t="1697531429761" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11075" width="200" height="200"><path d="M746.666667 85.333333c64.8 0 117.333333 52.533333 117.333333 117.333334v618.666666c0 64.8-52.533333 117.333333-117.333333 117.333334H277.333333c-64.8 0-117.333333-52.533333-117.333333-117.333334V202.666667c0-64.8 52.533333-117.333333 117.333333-117.333334h469.333334zM597.333333 778.666667H426.666667a32 32 0 0 0 0 64h170.666666a32 32 0 0 0 0-64z m149.333334-629.333334H277.333333a53.333333 53.333333 0 0 0-53.333333 53.333334v480h576V202.666667a53.333333 53.333333 0 0 0-53.333333-53.333334z" fill="#000000" p-id="11076"></path></svg>',
  REPLACE_IMAGE = '<svg t="1697533319539" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12984" width="200" height="200"><path d="M620.544 137.6c103.936 10.432 187.328 72.96 205.12 180.224h-60.16l97.088 144.448 97.152-144.448h-67.008c-17.792-144.448-127.168-238.336-265.344-251.712-19.136-1.536-36.864 14.848-36.864 35.712 1.28 17.92 13.568 34.24 30.016 35.776z m-150.4-73.024H132.416c-19.136 0-34.176 16.384-34.176 37.248v321.728c0 20.864 15.04 37.248 34.176 37.248h337.728c19.136 0 34.176-16.384 34.176-37.248V101.824c0-20.864-15.04-37.248-34.176-37.248z m-32.832 324.736H165.248V136.064h272.128v253.248h-0.064zM404.48 883.84c-116.224-10.432-205.12-87.872-209.216-216h64.256L162.496 523.392l-97.088 144.448h64.256c2.688 165.376 118.912 272.576 268.032 287.488 19.136 1.472 36.928-14.912 36.928-35.776a35.648 35.648 0 0 0-30.144-35.712z m489.6-323.264H556.288c-19.2 0-34.176 16.448-34.176 37.248v323.264c0 20.8 14.976 37.184 34.176 37.184h337.728c19.136 0 34.112-16.384 34.112-37.184V597.824c0.064-20.8-16.32-37.248-34.048-37.248z m-32.896 324.736H589.12V633.536h272.064v251.776z" p-id="12985"></path></svg>',
  MORE = '<svg t="1695306193711" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4188" id="mx_n_1695306193712" width="200" height="200"><path d="M896 469.333333v128h-128v-128h128z m-298.666667 0v128h-128v-128h128z m-298.666666 0v128H170.666667v-128h128z" fill="#444444" p-id="4189"></path></svg>',
  ALIGNS = '<svg t="1695306475232" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5229" id="mx_n_1695306475233" width="200" height="200"><path d="M96 128h832v96H96zM96 576h832v96H96zM96 352h576v96H96zM96 800h576v96H96z" p-id="5230"></path></svg>',
  INDENT = '<svg t="1695306773587" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7278" id="mx_n_1695306773588" width="200" height="200"><path d="M127.48531250000002 164.7598958333334H898.109375v82.9546875H127.484375v-82.9546875zM458.46125 320.2864583333333h439.6471875v82.955625H458.46125V320.2864583333333zM458.46125 475.8148958333333h439.6471875v82.95375H458.46125v-82.95375zM458.46125 631.3414583333334h439.6471875v82.9546875H458.46125v-82.9546875zM127.48531250000002 786.8680208333334H898.109375v82.955625H127.484375v-82.955625zM127.48531250000002 674.6802083333333V382.6452083333333L322.1778125 528.6645833333333z" p-id="7279"></path></svg>',
}