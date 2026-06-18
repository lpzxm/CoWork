import React, { useState } from 'react'
import { FaFilePdf, FaFileImage, FaFilePowerpoint, FaFileExcel, FaFileWord, FaFile } from "react-icons/fa";
import { Notification, toast, Tooltip } from "components/ui";
import dayjs from 'dayjs';

export const ExtensionIcon = ({fileName, showInTooltip=true}) => {
	
	const parts = fileName.split(".")
	const fileFormat = parts[parts.length - 1]

	let icon = <FaFile className="text-2xl text-slate-500"/>

	switch ( fileFormat ) {
		case ('xlsx' || 'xls'):
			icon = <FaFileExcel  className="text-2xl text-green-700"/>
		break;
		case ('docx' || 'doc'):
			icon = <FaFileWord className="text-2xl text-blue-700"/>
		break;
		case ('pptx' || 'ppt'):
			icon = <FaFilePowerpoint className="text-2xl text-red-700"/>
		break;
		case ('pdf'):
			icon = <FaFilePdf className="text-2xl text-rose-700" />
		break;
		case ('jpg' || 'png' || 'jpeg'):
			icon = <FaFileImage className="text-2xl text-green-700"/>
		break;
		case ('zip' || 'rar'):
			icon = <FaFileImage className="text-2xl text-yellow-700"/>
		break;
		default:
			icon = <FaFile className="text-2xl text-slate-500"/>
		break;
	}
	return showInTooltip ? <Tooltip title={
		<div>
			<strong className="text-white-400">{fileName}</strong>
		</div>
	}><span className="cursor-pointer">{icon}</span></Tooltip> : <span className="cursor-pointer">{icon}</span>

}

export const NoData = ({className=''}) => <span className={className} title='Dato no disponible o no ingresado'>n/d</span>


export const getInitialWord = (str ='') => {
	const parts = str.split(" ");
	return parts[0];
}

export const getListSeparatedByCommas = (list = []) => {
	return list?.map( (item, index) => (
		<React.Fragment key={`${item}-${index}`}>
			<span>
				{item}
			</span>
			{ index === list.length - 2 ? ' y ' : index === list.length - 1 ? '' : ', '}
		</React.Fragment>
	))
}

export const TextSlicer = (str = null, num=100) => str ?	str.length <= num ? str : str.substr(0,num-3) + '...'	: '-' ;

export const TextHabilitado = (num = null) => num === 1 ? 'Habilitado' : 'Deshabilitado' ;
export const TextActivo = (num = null) => num === 1 ? 'Activo' : 'Inactivo' ;

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const textSiNo = (num = null) => num === 1 ? 'Si' : 'No' ;

export const Weekday = (num = null,contracted=false) => {
	const days = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
	const daysContracted = ['dom','lun','mar','mié','jue','vie','sáb']
	return contracted ? daysContracted[num] :days[num];
}

export const getDistributorName = (num = null) => {
	const distributors = ['CAESS','CLESA','DELSUR','DEUSEM','EDESAL','EEO','B&D','ABRUZZO']
	return distributors[num-1];
}

export const getTimeInHHmmFormat = (dateString) =>
{
	let date = new Date(dateString);
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	const hoursStr = hours < 10 ? '0' + hours : '' + hours;
	const minutesStr = minutes < 10 ? '0' + minutes : '' + minutes;
	return hoursStr + ':' + minutesStr + ' ' + ampm;
}

export const extractTime = dateTimeStr => {
    const timePart = dateTimeStr.split(' ')[1]; // this gives you 'H:i:s'
    return timePart.substring(0, 7);            // this gives you 'H:i'
}

export const StringToDate = (str,separator='/',order=1) => {

	if ( order === 1 ) {
		const [day,month,year] = String(str).split(separator);
		return new Date(+year, +month - 1, +day);
	} else {
		const [year,month,day] = String(str).split(separator);
		return new Date(+year, +month - 1, +day);
	}
}

export const StringDateToStringDate = (str) =>
{
	const [day,month,year] = String(str).split('/');
	return year+'-'+(month)+'-'+day;
}

export const formatTime = timeString => {
	// Create a new Date object from the time string
	const date = new Date(`1970-01-01T${timeString}`);
  
	// Get hours, minutes, and seconds and pad them with leading zeros if needed
	const hours = String(date.getUTCHours()).padStart(2, '0');
	const minutes = String(date.getUTCMinutes()).padStart(2, '0');
	const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
	// Return the formatted time string
	return `${hours}:${minutes}:${seconds}`;
  }


export const stringDateToFormat = (dateString=null,showWeekDay=false,contracted=false,dayComma=false) =>
{
	if ( dateString ) {
		let [year, month, day] = dateString.split('-').map(Number);
		const date = new Date( year,(month-1), day); 
		const weekDay = showWeekDay ? Weekday(date.getDay(),contracted)+(dayComma?', ':' ') : '';
		month = String(month).length === 1 ? '0'+month : month;
		day = String(day).length === 1 ? '0'+day : day;
		year = contracted ?  String(year).slice(-2): year
		return weekDay+''+day+'/'+month+'/'+year;
	} else {
		return ''
	}
}

export const dateToStringFormat = (date,separator = '-') =>{
	date = date ?? new Date()
	const day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate()
	const month = (date.getMonth()+1) < 10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1)
	const year = date.getFullYear() < 10 ? '0'+date.getFullYear() : date.getFullYear()
	return year+separator+month+separator+day
}



export const dateStringToFormat = (date) => {
  return dayjs(date).format('DD/MM/YYYY');
}

export const dollarFormat = (num) =>
{
	const formatedNum = !isNaN((num)) ? '$'+ roundTwoDecimalsComas(num) : null;
	return formatedNum;
}

export const roundTwoDecimalsComas = (num) => {
	return addCommasToNumber(addZeroes(Number(num).toFixed(2)));
}

export const addCommasToNumber = (nStr) =>
{
	nStr += '';
	const x = nStr.split('.');
	let x1 = x[0];
	const x2 = x.length > 1 ? '.' + x[1] : '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1,$2');
	}
	return x1 + x2;
}

export const addZeroes = (num) =>
{
	let value = Number(num);
	let res = num.split(".");
	if(res.length === 1 || res[1].length < 3)
	{
		value = Number(value).toFixed(2);
	}
	return value;
}

export const intToHours = (num) =>
{
	const minutes = Number(num);
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = Math.floor(minutes % 60);
	return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
}

export const getDatesBetween = (dateIni,dateEnd) =>{
	let currentDate = new Date(dateIni);
	let dateEnded = new Date(dateEnd);

	currentDate.setDate(currentDate.getDate() + 1)
	dateEnded.setDate(dateEnded.getDate() + 1 )

	const dates = [];
	while (currentDate <= dateEnded) {
		const pushDate = new Date(currentDate)
		const fullYear = pushDate.getFullYear()
		const month = ('0' + (pushDate.getMonth()+1)).slice(-2)
		const date = ('0' + pushDate.getDate()).slice(-2)
		dates.push(fullYear+'-'+month+'-'+date)
		currentDate.setDate(currentDate.getDate() + 1)
	}
	return dates
}

export const addDaysToDate = (fecha, dias) => {
	const newdate = fecha.setDate(fecha.getDate() + dias);
	return new Date(newdate);
}

export const substractDaysToDate = (fecha, dias) => {
	const newdate = fecha.setDate(fecha.getDate() - dias);
	return new Date(newdate);
}

export const isWeekend = (date = new Date()) => {
	return date.getDay() === 6 || date.getDay() === 0;
}

export const convertToAmPm = timeStr => {

	if( timeStr ) {
		const [hours, minutes, seconds] = timeStr.split(':');
		const date = new Date();

		date.setHours(hours);
		date.setMinutes(minutes);
		date.setSeconds(seconds);

		const ampm = date.getHours() >= 12 ? 'pm' : 'am';
		let hours12 = date.getHours() % 12;
		if (hours12 === 0) { // Adjust for times at noon and midnight.
			hours12 = 12;
		}

		return `${zeroPad(hours12)}:${minutes} ${ampm}`;
	} else {
		return '-'
	}
}

export const zeroPad = num => {
    return num < 10 ? '0' + num : num;
}

// Helper function to normalize a string
export const normalize = (value) => {
	const str = String(value); // Convert to string if it's a number 
	return str.toLowerCase()
	.normalize('NFD') // Remove accent marks
	.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
	.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '') // Remove punctuation
	.replace(/\s+/g, ''); // Remove whitespace
}
  
  // Levenshtein distance function
export const levenshtein = (a, b) => {
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;

	const matrix = [];

	for (let i = 0; i <= b.length; i++) {
	matrix[i] = [i];
	}

	for (let j = 0; j <= a.length; j++) {
	matrix[0][j] = j;
	}

	for (let i = 1; i <= b.length; i++) {
	for (let j = 1; j <= a.length; j++) {
	if (b.charAt(i-1) === a.charAt(j-1)) {
		matrix[i][j] = matrix[i-1][j-1];
	} else {
		matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1));
	}
	}
	}

	return matrix[b.length][a.length];
}
  
  // Function to determine if two strings are 90% similar or more
  export const areSimilar = (a, b) => {
	const normalizedA = normalize(a);
	const normalizedB = normalize(b);
  
	const distance = levenshtein(normalizedA, normalizedB);
	const maxLength = Math.max(normalizedA.length, normalizedB.length);
  
	return (maxLength - distance) / maxLength >= 0.8;
  }

export const requestStatus = (val) => {
	let result ='';
	switch (val) {
		case 1:
			result = 'Planificado'
			break;
		case 2:
			result = 'En Proceso'
			break;
		case 3:
			result = 'Finalizado'
			break;
		case 4:
			result = 'Cancelado'
			break;
		default:
			result = 'N/A'
			break;
	}

	return result;
}

export const requestStatusColor = (val) => {
	let result ='';
	switch (val) {
		case 1:
			result = 'text-red-500'
			break;
		case 2:
			result = 'text-orange-500'
			break;
		case 3:
			result = 'text-green-500'
			break;
		case 4:
			result = 'text-slate-500'
			break;
		default:
			result = 'N/A'
			break;
	}

	return result;
}

export const progressColor = (val) => {
	if (val === null || val < 50) {
		return 'red-500';
	  }
	
	  if (val < 100) {
		return 'orange-500';
	  }
	
	  return 'green-500';
}

export const getRandomColor = () => {
	const colors = ['slate','gray','zinc','neutral','stone','red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose']
	const randomIndex = Math.floor(Math.random() * colors.length);
  	return colors[randomIndex];
}

export const openNotification = (type,title,message,placement,duration=9000) => {
	let BodyMessage = () => <>{message}</>
	if( typeof message === 'object' ) {
		BodyMessage = () => (
			<ul>
			{
				Object.entries(message).map( ([key, value]) =>
					<li key={`li-err-${key}`} className='text-justify'>{value[0]}</li>
				)
			}
			</ul>
		)
	}
	toast.push((
		<Notification closable title={title.charAt(0).toUpperCase() + title.slice(1)} type={type} duration={duration}>
			<BodyMessage/>
		</Notification>), {placement: placement}
	)
}

export const getLastWeekday = () => {
	var currentDate = new Date();
	while (currentDate.getDay() === 0 || currentDate.getDay() === 6 || currentDate >= new Date()) {
		currentDate.setDate(currentDate.getDate() - 1);
	}
	return currentDate;
}

export const TextTruncate = ({ text, maxLength = 30 }) => {
	const [isTruncated, setIsTruncated] = useState(true);
  
	const toggleTruncate = () => {
	  setIsTruncated(!isTruncated);
	};

	const handleToggleKeyDown = (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleTruncate();
		}
	};
  
	if (text.length <= maxLength) {
	  return <span>{text}</span>;
	}
  
	if (isTruncated) {
	  return (
		<button type="button" title={text} className="cursor-pointer text-left" onClick={toggleTruncate} onKeyDown={handleToggleKeyDown}>
		  {text.substring(0, maxLength)}...
		</button>
	  );
	}
  
	return (
	  <button type="button" title={text.substring(0, maxLength) + '...'} className="cursor-pointer text-left" onClick={toggleTruncate} onKeyDown={handleToggleKeyDown}>
		{text}
	  </button>
	);
  };
