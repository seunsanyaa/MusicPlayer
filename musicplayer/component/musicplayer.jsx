import { useContext, useEffect, useRef, useState } from 'react';
import audiostyle from './audioplayer.module.scss';
import Image from 'next/image';
import {
	mousePressed,
	muteSound,
	songDuration,
	stopSound,
	totalWaveTimer,
	waveTimer,
} from '../music';
import { useQueries, useQuery } from '@tanstack/react-query';
export default function MusicPlayer() {
	const blackBg = useRef();
	const [elements, setElements] = useState([
		<div className={audiostyle.minorWave}></div>,
	]);

	const [replay, setReplay] = useState(false);
	const [mutestate, setMuteState] = useState(false);

	const [count, setCount] = useState('0:00');
	const [playing, setPlaying] = useState(false); // Is the player currently playing the audio?
	const [playNext, setPlayNext] = useState(false);
	const [songData, setSongData] = useState({
		counter: 0,
		total: null,
	});
	const [totalDuration, setTotalDuration] = useState('0:00');

	const [songurl, setSongUrl] = useState([
		'https://ipfs.io/ipfs/QmWY8MhjQPZTXqtvPxM882VS24gTi3Z6FeQyQcW8DUEW4f',
		'https://yellow-just-rabbit-223.mypinata.cloud/ipfs/bafybeidco73wmk7lxsuo3ynnwetvp6ve6r74muwq4lmscv3qaibye5iorm?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmRleGVzIjpbIjkwOGJjNTJkNmNkYzg3NmI1ZGZkMGMwYWVhMTNlMzZiIl0sImFjY291bnRJZCI6ImI1NWZiZTM4LTZlZjAtNGVlZi04ODEwLWYyMjg1YjIwMjAxNyIsImlhdCI6MTY3MjA1NDE3MSwiZXhwIjoxNjcyMDU3MTcxfQ.IwSgiAJsGC2u94SWYqBUSM0gFyV8yOsGw1Xyromikbk&pinataGatewayToken=bdBHDwnew4LB62vcwc_b_lr99bOsNZDCT642R5_BR39Gb8RgPdXdQ0mgDHXdKzu8',
	]);
	const [
		fetchSongQuery,
		fetchDurationQuery,
		fetchTimerQuery,
		fetchTotalTimerQuery,
		stopSongQuery,
	] = useQueries({
		queries: [
			{
				queryKey: ['fetchSong', songurl],
				queryFn: () => mousePressed(songurl),
				enabled: false,
			},

			{
				queryKey: ['fetchDuration', count, songurl],
				queryFn: () => songDuration(),
				enabled: false,
			},

			{
				queryKey: ['fetchTimer', count, songurl],
				queryFn: () => waveTimer(),
				enabled: false,
			},

			{
				queryKey: ['fetchTotalTimer', count, songurl],
				queryFn: () => totalWaveTimer(),
				enabled: false,
			},

			{
				queryKey: ['stopSong'],
				queryFn: () => stopSound(),
				enabled: false,
			},
		],
	});

	const onPlay = async () => {
		fetchSongQuery.refetch();
		setPlaying(!playing);

	};

	const playNextSong	= async () => {







	}

	useEffect(() => {
		if (!fetchSongQuery.isLoading && !fetchSongQuery.error) {
			setTotalDuration(fetchSongQuery.data);
			console.log(fetchSongQuery.data);
			fetchTotalTimerQuery.refetch();
		}
	}, [fetchSongQuery.data, fetchSongQuery.error, fetchSongQuery.isLoading]);

	useEffect(() => {
		if (!fetchTotalTimerQuery.isLoading && !fetchTotalTimerQuery.error) {
			setSongData({
				...songData,
				total: fetchTotalTimerQuery.data,
			});
		}
	}, [
		fetchTotalTimerQuery.data,
		fetchTotalTimerQuery.error,
		fetchTotalTimerQuery.isLoading,
	]);

	useEffect(() => {
		if (!fetchDurationQuery.isLoading && !fetchDurationQuery.error) {
			setCount(fetchDurationQuery.data);
		}
	}, [
		fetchDurationQuery.data,
		fetchDurationQuery.error,
		fetchDurationQuery.isLoading,
		playing,
	]);

	useEffect(() => {
		if (!fetchTimerQuery.isLoading && !fetchTimerQuery.error) {
			setSongData({ ...songData, counter: fetchTimerQuery.data });
		}
	}, [fetchTimerQuery.data, fetchTimerQuery.error, fetchTimerQuery.isLoading]);

	useEffect(() => {
		if (!stopSongQuery.isLoading && !stopSongQuery.error) {
			console.log('about to replay');

			fetchSongQuery.refetch();

			setPlaying(true);
		}
	}, [stopSongQuery.data, stopSongQuery.error, stopSongQuery.isLoading]);

	const [test, setTest] = useState(false);
	useEffect(() => {
		setTimeout(() => {
			fetchDurationQuery.refetch();
			fetchTimerQuery.refetch();

			if (songData.counter === songData.total) {
				clearTimeout();

				fetchDurationQuery.remove();

				fetchTimerQuery.remove();
				translateDiv(0);
				stopSongQuery.refetch();
			}
		}, 1000);
	}, [count, totalDuration, playing, songurl]);

	useEffect(() => {
		const waveArray = elements.map((element) =>
			Array(80)
				.fill(element)
				.map(() => {
					return element;
				})
		);
		setElements(waveArray);
	}, []);

	const translateDiv = (offset) => {
		blackBg.current.style.transform = `translateX(${offset - 100}%)`;
	};

	useEffect(() => {
		if (songData.counter != 0) {
			const fixedPercent = Math.round(
				(songData?.counter / songData?.total) * 100
			);

			const wavePercentage = Math.round((fixedPercent / 80) * 80);
			translateDiv(wavePercentage);
		}
	}, [songData.counter]);

	return (
		<>
			{/* {showPlayer ? ( */}
			<div
				className={audiostyle.mainContainer}
				// style={{ display: miniPlayerState ? 'none' : 'flex' }}
			>
				<div className={audiostyle.container}>
					<div className={audiostyle.profilePictureAndName}>
						<div className={audiostyle.profilePictureDiv}>
							<Image
								width={48}
								height={48}
								className={audiostyle.profilePicture}
								src='https://res.cloudinary.com/dqechrbjo/image/upload/v1670343636/photo-1600456899121-68eda5705257_cxnsrf.avif'
							/>
						</div>

						<div className={audiostyle.nameAndSong}>
							<h2 className={audiostyle.name}>
								{/* {artist.username} */}
								Seun
							</h2>

							<h2 className={audiostyle.songName}>
								{/* {title} */}
								song
							</h2>
						</div>
					</div>

					<div className={audiostyle.firstGrid}>
						<div className={audiostyle.navigateButtons}>
							<svg
								width='12'
								height='12'
								viewBox='0 0 12 12'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M3.87675 5.63082L11.2613 0.0924099C11.3998 -0.0128199 11.5881 -0.0294352 11.7441 0.0490257C11.901 0.127487 11.9998 0.287178 11.9998 0.461638V11.5385C11.9998 11.7129 11.901 11.8726 11.745 11.9511C11.6795 11.9834 11.6084 12 11.5382 12C11.4404 12 11.3425 11.9686 11.2613 11.9077L3.87675 6.36928C3.76044 6.28251 3.69213 6.14497 3.69213 6.00005C3.69213 5.85513 3.76044 5.71759 3.87675 5.63082Z'
									fill='#B6B6B6'
								/>
								<path
									d='M0.461771 0H1.38484C1.63961 0 1.84637 0.206767 1.84637 0.461535V11.5384C1.84637 11.7931 1.63961 11.9999 1.38484 11.9999H0.461771C0.207004 11.9999 0.000236511 11.7931 0.000236511 11.5384V0.461535C0.000236511 0.206767 0.207004 0 0.461771 0Z'
									fill='#B6B6B6'
								/>
							</svg>
							<div className={audiostyle.playButton} onClick={onPlay}>
								{playing ? (
									<svg
										width='11'
										height='14'
										viewBox='0 0 11 14'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M6.7645 0H9.80426C9.99341 0 10.1468 0.153359 10.1468 0.342508V13.6575C10.1468 13.8466 9.99341 14 9.80426 14H6.7645C6.57536 14 6.422 13.8466 6.422 13.6575V0.342508C6.422 0.153359 6.57536 0 6.7645 0Z'
											fill='#0F0F0F'
										/>
										<path
											d='M0.342569 0H3.38232C3.57147 0 3.72483 0.153359 3.72483 0.342508V13.6575C3.72483 13.8466 3.57147 14 3.38232 14H0.342569C0.15342 14 6.10352e-05 13.8466 6.10352e-05 13.6575V0.342508C6.10352e-05 0.153359 0.15342 0 0.342569 0Z'
											fill='#0F0F0F'
										/>
									</svg>
								) : (
									<svg
										width='12'
										height='14'
										viewBox='0 0 12 14'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M2.17387 0.308689C0.973189 -0.415314 -0.000244141 0.177798 -0.000244141 1.63238V12.3666C-0.000244141 13.8226 0.973189 14.4149 2.17387 13.6916L11.0989 8.31099C12.3 7.58673 12.3 6.41333 11.0989 5.68924L2.17387 0.308689Z'
											fill='#0F0F0F'
										/>
									</svg>
								)}
							</div>

							<svg
								width='12'
								height='12'
								viewBox='0 0 12 12'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M8.12276 5.63082L0.738211 0.0924099C0.599751 -0.0128199 0.411445 -0.0294352 0.255446 0.0490257C0.0985243 0.127487 -0.000244141 0.287178 -0.000244141 0.461638V11.5385C-0.000244141 11.7129 0.0985242 11.8726 0.254523 11.9511C0.320061 11.9834 0.391137 12 0.46129 12C0.559136 12 0.656981 11.9686 0.738211 11.9077L8.12276 6.36928C8.23907 6.28251 8.30738 6.14497 8.30738 6.00005C8.30738 5.85513 8.23907 5.71759 8.12276 5.63082Z'
									fill='#B6B6B6'
								/>
								<path
									d='M11.5377 0H10.6147C10.3599 0 10.1531 0.206767 10.1531 0.461535V11.5384C10.1531 11.7931 10.3599 11.9999 10.6147 11.9999H11.5377C11.7925 11.9999 11.9993 11.7931 11.9993 11.5384V0.461535C11.9993 0.206767 11.7925 0 11.5377 0Z'
									fill='#B6B6B6'
								/>
							</svg>
						</div>

						<div className={audiostyle.majorWave}>
							<div className={audiostyle.blackBackground} ref={blackBg}></div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									gap: '0.32rem',
									overflow: 'hidden',
									background: 'white',
									position: 'relative',
									// zIndex: 1,
								}}
							>
								{elements}
								{/* {elements.map((element) =>
									Array(80)
										.fill(element)
										.map(() => {
											return element;
										})
								)} */}
							</div>
							{/* <div className={audiostyle.minorWave}></div> */}
						</div>

						{/* <div className={audiostyle.waveFormContainer}>
							<div className={audiostyle.waveFormSvg}>
								<svg
									width='516'
									height='32'
									viewBox='0 0 516 32'
									fill='white'
									xmlns='http://www.w3.org/2000/svg'
									className={audiostyle.white}
									// style={{ background: 'white' }}
								>
									<rect
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
										fill-opacity='0'
									/>
									<rect
										x='6.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
										fill-opacity='0'
									/>
									<rect
										x='13'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='19.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='26'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='32.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='39'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='45.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='52'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='58.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='65'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='71.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='78'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='84.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='91'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='97.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='104'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='110.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='117'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='123.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='130'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='136.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='143'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='149.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='156'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='162.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='169'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='175.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='182'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='188.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='195'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='201.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='208'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='214.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='221'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='227.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='234'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='240.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='247'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='253.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='260'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='266.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='273'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='279.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='286'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='292.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='299'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='305.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='312'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='318.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='325'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='331.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='338'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='344.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='351'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='357.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='364'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='370.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='377'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='383.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='390'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='396.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='403'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='409.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='416'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='422.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='429'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='435.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='442'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='448.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='455'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='461.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='468'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='474.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='481'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='487.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='494'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='500.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='507'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
									<rect
										x='513.5'
										width='2.5'
										height='32'
										rx='1.25'
										fill='#DFDFDF'
									/>
								</svg>
							</div>
							<div class={audiostyle.waveDiv}></div>
							<div className={audiostyle.blackBackground}></div>
						</div> */}
						{/* 
						{waveSvg ? (
							<svg
								width='516'
								height='32'
								viewBox='0 0 516 32'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<rect width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='6.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='13' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='19.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='26' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='32.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='39' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='45.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='52' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='58.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='65' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='71.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='78' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='84.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='91' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='97.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='104'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='110.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='117'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='123.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='130'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='136.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='143'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='149.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='156'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='162.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='169'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='175.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='182'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='188.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='195'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='201.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='208'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='214.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='221'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='227.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='234'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='240.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='247'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='253.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='260'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='266.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='273'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='279.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='286'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='292.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='299'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='305.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='312'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='318.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='325'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='331.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='338'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='344.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='351'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='357.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='364'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='370.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='377'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='383.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='390'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='396.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='403'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='409.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='416'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='422.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='429'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='435.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='442'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='448.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='455'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='461.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='468'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='474.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='481'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='487.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='494'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='500.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='507'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='513.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
							</svg>
						) : (
							<svg
								width='516'
								height='32'
								viewBox='0 0 516 32'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								ref={svg}
							>
								<rect width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='6.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='13' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='19.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='26' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='32.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='39' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='45.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='52' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='58.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='65' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='71.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='78' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='84.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect x='91' width='2.5' height='32' rx='1.25' fill='#DFDFDF' />
								<rect
									x='97.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='104'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='110.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='117'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='123.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='130'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='136.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='143'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='149.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='156'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='162.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='169'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='175.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='182'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='188.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='195'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='201.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='208'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='214.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='221'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='227.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='234'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='240.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='247'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='253.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='260'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='266.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='273'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='279.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='286'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='292.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='299'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='305.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='312'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='318.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='325'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='331.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='338'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='344.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='351'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='357.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='364'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='370.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='377'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='383.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='390'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='396.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='403'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='409.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='416'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='422.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='429'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='435.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='442'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='448.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='455'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='461.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='468'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='474.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='481'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='487.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='494'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='500.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='507'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
								<rect
									x='513.5'
									width='2.5'
									height='32'
									rx='1.25'
									fill='#DFDFDF'
								/>
							</svg>
						)} */}

						<div className={audiostyle.timeAndSpeakerDiv}>
							<div className={audiostyle.maintime}>
								<span className={audiostyle.time} style={{ width: '1.5rem' }}>
									{count}
								</span>

								<div className='slash' style={{ width: '2rem' }}>
									/
								</div>
								<span className={audiostyle.time} style={{ width: '2rem' }}>
									{totalDuration}
								</span>
							</div>

							<div className={audiostyle.repeat}>
								<svg
									width='17'
									height='19'
									viewBox='0 0 17 19'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M3.64444 4.55556H12.7556V7.28889L16.4 3.64444L12.7556 0V2.73333H1.82222V8.2H3.64444V4.55556ZM12.7556 13.6667H3.64444V10.9333L0 14.5778L3.64444 18.2222V15.4889H14.5778V10.0222H12.7556V13.6667Z'
										fill='#B6B6B6'
									/>
								</svg>
							</div>

							<div
								className={audiostyle.speaker}
								onClick={() => {
									muteSound();
									setMuteState(!mutestate);
								}}
								style={{ width: '3rem' }}
							>
								{mutestate ? (
									<svg
										width='15'
										height='14'
										viewBox='0 0 15 14'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											fill-rule='evenodd'
											clip-rule='evenodd'
											d='M10.7108 13.6943C11.0225 13.5481 11.2217 13.2347 11.2217 12.8902L11.2218 9.93528L4.88576 4.2303H2.32034C1.82964 4.2303 1.4317 4.62825 1.4317 5.11915V8.65941C1.4317 9.15011 1.82964 9.54847 2.32034 9.54847H4.9076L9.76578 13.5742C9.92836 13.7088 10.1296 13.7786 10.3326 13.7786C10.4611 13.7786 10.5903 13.7511 10.7108 13.6943ZM5.85723 3.44375L11.2218 8.27406L11.2221 0.889016C11.2221 0.544497 11.0225 0.231107 10.7112 0.0849279C10.3997 -0.0623024 10.0316 -0.015399 9.7662 0.204605L5.85723 3.44375Z'
											fill='black'
										/>
										<rect
											y='1.48779'
											width='1.23369'
											height='18.6995'
											rx='0.616845'
											transform='rotate(-48 0 1.48779)'
											fill='black'
										/>
									</svg>
								) : (
									<svg
										width='18'
										height='14'
										viewBox='0 0 18 14'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M8.81687 12.4934C8.81687 12.8038 8.6375 13.0859 8.35678 13.2175C8.24824 13.2688 8.13194 13.2937 8.01639 13.2937C7.83341 13.2937 7.65214 13.2308 7.50572 13.1094L3.13052 9.48388H0.800294C0.35838 9.48426 0 9.12569 0 8.68377V5.49529C0 5.05318 0.35838 4.6948 0.800294 4.6948H3.13071L7.50591 1.06933C7.74495 0.871197 8.07644 0.828956 8.35697 0.961549C8.6375 1.0932 8.81706 1.37543 8.81706 1.6857L8.81687 12.4934ZM11.8925 11.2428C11.873 11.2441 11.8542 11.2449 11.8349 11.2449C11.6235 11.2449 11.4197 11.1614 11.2691 11.0106L11.1621 10.9032C10.8813 10.623 10.8484 10.1792 11.0848 9.86063C11.6841 9.05257 12.0004 8.09468 12.0004 7.08981C12.0004 6.00899 11.6413 4.99522 10.9617 4.15799C10.7029 3.83977 10.7268 3.37759 11.0168 3.08777L11.1236 2.98075C11.2835 2.82088 11.4977 2.73375 11.7296 2.74758C11.9554 2.75894 12.1662 2.86521 12.3094 3.04023C13.2521 4.19379 13.7501 5.59435 13.7501 7.09C13.7501 8.48299 13.3097 9.80892 12.4763 10.9238C12.337 11.1097 12.1241 11.2263 11.8925 11.2428ZM15.2012 13.7161C15.0565 13.8871 14.8472 13.9898 14.6231 13.9992C14.6121 13.9996 14.601 14 14.5896 14C14.3776 14 14.1742 13.9163 14.0236 13.7657L13.9185 13.6606C13.6247 13.367 13.6048 12.8974 13.8719 12.5795C15.1626 11.0445 15.8737 9.095 15.8737 7.08981C15.8737 5.00412 15.1124 2.99629 13.7306 1.43623C13.4504 1.11952 13.4646 0.640106 13.7628 0.340824L13.8677 0.235697C14.0234 0.079237 14.2257 -0.00694848 14.4578 0.000438852C14.6781 0.00668967 14.8864 0.104051 15.0328 0.268845C16.7031 2.14939 17.6231 4.57206 17.6231 7.08981C17.6235 9.51229 16.7634 11.8656 15.2012 13.7161Z'
											fill='#212121'
										/>
									</svg>
								)}
							</div>
						</div>
					</div>
					<div className={audiostyle.shareAndShrink}>
						<div className={audiostyle.share}>
							<svg
								width='32'
								height='32'
								viewBox='0 0 32 32'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<circle cx='16' cy='16' r='16' fill='#212121' />
								<path
									d='M21.733 11.7335C21.733 12.6909 20.9571 13.4669 19.9997 13.4669C19.0424 13.4669 18.2664 12.6909 18.2664 11.7335C18.2664 10.7763 19.0424 10.0002 19.9997 10.0002C20.9571 10.0002 21.733 10.7763 21.733 11.7335Z'
									fill='white'
								/>
								<path
									d='M19.9995 13.8668C18.823 13.8668 17.8662 12.91 17.8662 11.7334C17.8662 10.5569 18.823 9.6001 19.9995 9.6001C21.1761 9.6001 22.1328 10.5569 22.1328 11.7334C22.1328 12.91 21.1761 13.8668 19.9995 13.8668ZM19.9995 10.4001C19.2641 10.4001 18.6662 10.9985 18.6662 11.7334C18.6662 12.4684 19.2641 13.0668 19.9995 13.0668C20.735 13.0668 21.3328 12.4684 21.3328 11.7334C21.3328 10.9985 20.735 10.4001 19.9995 10.4001Z'
									fill='white'
								/>
								<path
									d='M21.7335 20.2678C21.7335 21.225 20.9576 22.0011 20.0002 22.0011C19.0429 22.0011 18.2669 21.225 18.2669 20.2678C18.2669 19.3105 19.0429 18.5344 20.0002 18.5344C20.9576 18.5344 21.7335 19.3105 21.7335 20.2678Z'
									fill='white'
								/>
								<path
									d='M20 22.4015C18.8235 22.4015 17.8667 21.4446 17.8667 20.2682C17.8667 19.0916 18.8235 18.1348 20 18.1348C21.1766 18.1348 22.1333 19.0916 22.1333 20.2682C22.1333 21.4446 21.1766 22.4015 20 22.4015ZM20 18.9348C19.2646 18.9348 18.6667 19.5332 18.6667 20.2682C18.6667 21.003 19.2646 21.6015 20 21.6015C20.7355 21.6015 21.3333 21.003 21.3333 20.2682C21.3333 19.5332 20.7355 18.9348 20 18.9348Z'
									fill='white'
								/>
								<path
									d='M14.2664 15.9992C14.2664 16.9565 13.4903 17.7325 12.533 17.7325C11.5758 17.7325 10.7997 16.9565 10.7997 15.9992C10.7997 15.0418 11.5758 14.2659 12.533 14.2659C13.4903 14.2659 14.2664 15.0418 14.2664 15.9992Z'
									fill='white'
								/>
								<path
									d='M12.5333 18.1323C11.3568 18.1323 10.4 17.1756 10.4 15.999C10.4 14.8225 11.3568 13.8657 12.5333 13.8657C13.7099 13.8657 14.6667 14.8225 14.6667 15.999C14.6667 17.1756 13.7099 18.1323 12.5333 18.1323ZM12.5333 14.6657C11.7979 14.6657 11.2 15.2641 11.2 15.999C11.2 16.734 11.7979 17.3323 12.5333 17.3323C13.2689 17.3323 13.8667 16.734 13.8667 15.999C13.8667 15.2641 13.2689 14.6657 12.5333 14.6657Z'
									fill='white'
								/>
								<path
									d='M13.7922 15.7437C13.6066 15.7437 13.4263 15.6471 13.3282 15.4743C13.1826 15.2189 13.2722 14.893 13.5277 14.7468L18.4764 11.9255C18.7319 11.7788 19.0578 11.8685 19.204 12.1249C19.3496 12.3804 19.2599 12.7063 19.0044 12.8524L14.0556 15.6737C13.9724 15.7212 13.8818 15.7437 13.7922 15.7437Z'
									fill='white'
								/>
								<path
									d='M18.7409 20.1449C18.6513 20.1449 18.5607 20.1225 18.4775 20.075L13.5286 17.2537C13.2732 17.1081 13.1836 16.7822 13.3292 16.5262C13.4742 16.2702 13.8006 16.1801 14.0567 16.3268L19.0055 19.148C19.2609 19.2937 19.3505 19.6195 19.2049 19.8756C19.1063 20.0483 18.926 20.1449 18.7409 20.1449Z'
									fill='white'
								/>
							</svg>{' '}
						</div>

						<div
							className={audiostyle.shrink}

							// onClick={miniPlayerStateHandler}
						>
							<svg
								width='18'
								height='18'
								viewBox='0 0 18 18'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M1.54332 17.7336L6.30156 12.9664V17.095C6.30156 17.3336 6.39633 17.5623 6.56501 17.731C6.7337 17.8997 6.96248 17.9945 7.20104 17.9945C7.4396 17.9945 7.66838 17.8997 7.83707 17.731C8.00575 17.5623 8.10052 17.3336 8.10052 17.095V10.7986C8.10052 10.5601 8.00575 10.3313 7.83707 10.1626C7.66838 9.99394 7.4396 9.89917 7.20104 9.89917H0.904694C0.666137 9.89917 0.437351 9.99394 0.268666 10.1626C0.0999816 10.3313 0.00521548 10.5601 0.00521548 10.7986C0.00521548 11.0372 0.0999816 11.266 0.268666 11.4347C0.437351 11.6034 0.666137 11.6981 0.904694 11.6981H5.0333L0.266064 16.4564C0.181757 16.54 0.114841 16.6395 0.0691761 16.7491C0.0235108 16.8587 0 16.9763 0 17.095C0 17.2137 0.0235108 17.3313 0.0691761 17.4409C0.114841 17.5505 0.181757 17.65 0.266064 17.7336C0.349682 17.8179 0.449166 17.8848 0.558775 17.9305C0.668385 17.9762 0.785952 17.9997 0.904694 17.9997C1.02344 17.9997 1.141 17.9762 1.25061 17.9305C1.36022 17.8848 1.4597 17.8179 1.54332 17.7336Z'
									fill='#7B7B7B'
								/>
								<path
									d='M17.7335 0.266064C17.6499 0.181757 17.5504 0.114841 17.4408 0.0691761C17.3312 0.0235108 17.2136 0 17.0949 0C16.9761 0 16.8586 0.0235108 16.749 0.0691761C16.6394 0.114841 16.5399 0.181757 16.4563 0.266064L11.698 5.0333V0.904694C11.698 0.666137 11.6033 0.437351 11.4346 0.268666C11.2659 0.0999816 11.0371 0.00521548 10.7985 0.00521548C10.56 0.00521548 10.3312 0.0999816 10.1625 0.268666C9.99383 0.437351 9.89906 0.666137 9.89906 0.904694V7.20104C9.89906 7.4396 9.99383 7.66838 10.1625 7.83707C10.3312 8.00575 10.56 8.10052 10.7985 8.10052H17.0949C17.3334 8.10052 17.5622 8.00575 17.7309 7.83707C17.8996 7.66838 17.9944 7.4396 17.9944 7.20104C17.9944 6.96248 17.8996 6.7337 17.7309 6.56501C17.5622 6.39633 17.3334 6.30156 17.0949 6.30156H12.9663L17.7335 1.54332C17.8178 1.4597 17.8847 1.36022 17.9304 1.25061C17.9761 1.141 17.9996 1.02344 17.9996 0.904694C17.9996 0.785952 17.9761 0.668385 17.9304 0.558775C17.8847 0.449166 17.8178 0.349682 17.7335 0.266064Z'
									fill='#7B7B7B'
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
			{/* ) : null} */}
		</>
	);
}
