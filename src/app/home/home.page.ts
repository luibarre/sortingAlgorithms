import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AlertController, PickerController, Platform } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  public folder: string;
  public isMD = this.platform.is("android");

  formForElements: FormGroup;
  elements: any[] = [];
  final: number[] = [];

  defArrLenOpts: { text: string; value: number }[]; // add this variable, assign initial value before creating picker
  defaultLengthOpt = 5;
  selectedLengthOpt;
  min = 0;
  max = 999;
  constructor(
    private activatedRoute: ActivatedRoute,
    private pickerCtrl: PickerController,
    private platform: Platform,
    public alertController: AlertController
  ) {
    // assign initial value here in constructor or inside ngOnInit hook:
    this.defArrLenOpts = this.initLenOpts(5, 8);

    this.selectedLengthOpt = this.defaultLengthOpt;
  }

  onSubmit() {}

  initLenOpts(minValueLength: number, times: number) {
    let result: { text: string; value: number }[] = [];
    for (var i = minValueLength; i < minValueLength + times; i++) {
      result.push({ text: i.toString(), value: i });
    }
    console.log("result.", result);
    return result;
  }
  onRun(newRawElement: string) {
    let newNonNumElem: number[] = [];
    const oldElements = this.elements;
    let newElements: number[];
    if (!newRawElement) {
      newElements = this.randomNums(
        this.min,
        this.max,
        +this.selectedLengthOpt
      );
      this.elements = newElements;
    } else {
      newNonNumElem = this.removeNonNum(newRawElement);
      newElements = this.removeDup(newNonNumElem);
      console.log("newEle: ", newElements);
      if (
        newElements.length < this.defArrLenOpts[0].value ||
        newElements.length >
          this.defArrLenOpts[this.defArrLenOpts.length - 1].value
      ) {
        this.presentAlert({
          header: "Alert",
          subHeader: "subHeader",
          message: "Please enter 5 to 12 positive integers between 0 and 999.",
          buttons: ["OK"],
        });
      } else {
        this.elements = newElements;
      }
    }

    this.formForElements.reset();
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("submitted");
  }

  removeNonNum(arr) {
    const regexp = new RegExp("[^0-9]");
    let result: number[] = [];
    result = arr.split(regexp).filter((e) => {
      return e.length > 0 && !isNaN(+e) && e[0] != 0;
    });

    return result;
  }

  removeDup(arr) {
    let result = [];
    result = arr.filter((item, pos) => {
      return arr.indexOf(item) == pos;
    });
    return result;
  }
  randomNums(min: number, max: number, length: number) {
    let result = [];
    while (result.length < length) {
      let r = Math.floor(Math.random() * max) + min;
      if (result.indexOf(r) === -1) result.push(r);
    }

    return result;
  }

  async openPicker() {
    let opts = {
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Done",
        },
      ],
      columns: [
        {
          name: "Length",
          options: this.defArrLenOpts,
        },
      ],
    };
    let picker = await this.pickerCtrl.create(opts);
    picker.present();
    picker.onDidDismiss().then(async (data) => {
      let col = await picker.getColumn("Length");
      console.log("col: ", col);
      this.selectedLengthOpt = +col.options[col.selectedIndex].text;
      console.log("selectedLengthOpt: ", this.selectedLengthOpt);
      if (this.selectedLengthOpt) {
      }
    });
  }

  arrayLengthHasChanged(ev) {
    if (ev) {
      this.selectedLengthOpt = ev.detail.value;
    }
  }

  onReset() {
    this.elements.splice(0, this.elements.length);
    this.formForElements.reset();
  }

  async presentAlert({ header, subHeader, message, buttons }) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons,
    });

    await alert.present();
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get("id");
    this.initForm();
  }

  ngOnDestroy() {}

  ionViewWillEnter() {}

  ionViewDidEnter() {}

  ionViewWillLeave() {}

  ionViewDidLeave() {}

  private initForm() {
    this.formForElements = new FormGroup({
      inputNumber: new FormControl(
        null,
        Validators.compose([Validators.minLength(this.selectedLengthOpt), Validators.maxLength(200)])
      ),
    });
  }
}
