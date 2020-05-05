#define B_CENTER 4
#define B_LEFT 11
#define B_UP 12
#define B_DOWN 7
#define B_RIGHT 8

#define L_CENTER 9
#define L_LEFT 3
#define L_UP 5
#define L_DOWN 10
#define L_RIGHT 6
void setup() {
  Serial.begin(19200);
  pinMode(B_CENTER, INPUT_PULLUP);
  pinMode(B_LEFT, INPUT_PULLUP);
  pinMode(B_UP, INPUT_PULLUP);
  pinMode(B_DOWN, INPUT_PULLUP);
  pinMode(B_RIGHT, INPUT_PULLUP);

  pinMode(L_CENTER, OUTPUT);
  pinMode(B_LEFT, OUTPUT);
  pinMode(B_UP, OUTPUT);
  pinMode(B_DOWN, OUTPUT);
  pinMode(B_RIGHT, OUTPUT);
}
char inputField[]={'\'', '_', '\'', ':', '#'};
int B_key[5]={B_CENTER, B_LEFT, B_UP, B_DOWN, B_RIGHT};
String B_str[5]={String("confirm"), String("left"), String("up"), String("down"), String("right")};
bool B_states[5]={HIGH, HIGH, HIGH, HIGH, HIGH};

uint8_t colors[3];
void loop() {
  for(int k=0; k<5; k++) {
    //Serial.println(digitalRead(B_key[k]));
    if(digitalRead(B_key[k])!=B_states[k]) {
      B_states[k]=digitalRead(B_key[k]);
      if(B_states[k]==LOW) {
        Serial.print(B_str[k]);
        Serial.print('\n');
      }
    }
  }
  if(Serial.available()>0) {
    int data=-1;
    if((data=Serial.read())!=-1) {
      if(data=='\'') {
        while(!Serial.available()) {}
        int key=0;
        switch(data=Serial.read()) {
          case 'c':
            key=L_CENTER;
            break;
         case 'u':
            key=L_UP;
            break;
         case 'd':
            key=L_DOWN;
            break;
         case 'l':
            key=L_LEFT;
            break;
         case 'r':
            key=L_RIGHT;
            break;
        }
        
        int i=2;
        bool matching=true;
        while(i<4 && matching) {
          while(!Serial.available()) {}
          while((data=Serial.read())!=-1 && i<4) {
            if (data!=inputField[i]) {
              matching=false;
              break;
            }
            i++;
          }
        }

        
        if(matching && i==4) {
          //there's  'key':#
          for(i=0; i<3; i++) {
            colors[i]=0;
          }
          for(i=0; i<6; i++) {
            while(!Serial.available()) {}
            data=Serial.read();
            if(data>48) {
              data=data-48;
            }
            else {
              data=0;
            }
            
            if(((i/2)%2)==1) {
              
              colors[i/2]=data;
            }
            else {
              colors[i/2]+=data*16;
            }
          }
          bool enabled=false;
          for(i=0; i<3; i++) {
            Serial.println(colors[i]);
            if(colors[i]>0) {
              enabled=true;
            }
          }
          if (enabled) {
            Serial.println("turning on");
            Serial.print(key);
            digitalWrite(key, HIGH);
          }
          else {
            Serial.println("turning off");
            Serial.print(key);
            digitalWrite(key, LOW);
          }
        }
      }
    }
  }

}
